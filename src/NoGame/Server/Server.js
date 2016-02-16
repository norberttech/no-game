'use strict';

import ws from 'ws';
import Connection from './Network/Connection';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';
import TilesMessage from './Network/TilesMessage';
import MoveMessage from './Network/MoveMessage';
import CharactersMessage from './Network/CharactersMessage';
import CharacterMoveMessage from './Network/CharacterMoveMessage';
import CharacterSayMessage from './Network/CharacterSayMessage';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';
import Player from './../Engine/Player';
import Position from './../Engine/Map/Area/Position';
import ClientMessages from './../Common/Network/ClientMessages'

const VISIBLE_TILES = {x: 15, y: 11};

export default class Server
{
    /**
     * @param {Kernel} kernel
     * @param {boolean} debug
     */
    constructor(kernel, debug = false)
    {
        this._kernel = kernel;
        this._debug = debug;
        this._connections = new Map();
    }

    /**
     * @param {integer} port
     */
    listen(port = 8080)
    {
        Assert.integer(port);

        let onConnection = (socket) => {
            let connection = new Connection(socket);

            connection.bindOnMessage(this.onMessage.bind(this));
            connection.bindOnClose(this.onClose.bind(this));

            this._connections.set(connection.id(), connection);
            console.log(`New connection with id: ${connection.id()}`);
        };

        this._server = ws.createServer({ port: port, verifyClient: !this._debug}, onConnection);
    }

    /**
     * @param {string} rawPacket
     * @param {Connection} currentConnection
     */
    onMessage(rawPacket, currentConnection)
    {
        let packet = JSON.parse(rawPacket);

        switch (packet.name) {
            case ClientMessages.LOGIN:
                    this._handleLogin(packet, currentConnection);
                break;
            case ClientMessages.MOVE:
                    this._handleMove(packet, currentConnection);
                break;
            case ClientMessages.MESSAGE:
                    this._handleMessage(packet, currentConnection);
                break;
            default:
                console.log(packet);
                break;
        }
    }

    /**
     * @param {Connection} closedConnection
     */
    onClose(closedConnection)
    {
        console.log(`Connection ${closedConnection.id()} closed.`);

        if (closedConnection.hasPlayerId()) {
            // logout player
            this._kernel.logout(closedConnection.playerId());

            // update other players characters list
            this._sendToOtherConnectedClients(closedConnection, (connection) => {
                return new CharactersMessage(
                    this._kernel.playerArea(connection.playerId()).visiblePlayersFor(connection.playerId())
                )
            });
        }

        this._connections.delete(closedConnection.id());
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleLogin(packet, currentConnection)
    {
        let player = new Player(packet.data.username);
        this._kernel.login(player);
        currentConnection.setPlayerId(player.id());
        currentConnection.send(new LoginMessage(player));
        currentConnection.send(new AreaMessage(
            this._kernel.playerArea(player.id()).name(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        ));
        currentConnection.send(new TilesMessage(
            this._kernel.playerArea(player.id()).visibleTilesFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y))
        );

        this._sendToAllConnectedClients((connection) => {
            return new CharactersMessage(
                this._kernel.playerArea(connection.playerId()).visiblePlayersFor(connection.playerId())
            )
        });
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleMove(packet, currentConnection)
    {
        let area = this._kernel.playerArea(currentConnection.playerId());
        let requestedPosition = new Position(packet.data.x, packet.data.y);
        let player = area.player(currentConnection.playerId());

        if (player.isMoving()) {
            return;
        }

        area.movePlayerTo(currentConnection.playerId(), requestedPosition);

        let currentPosition = area.player(currentConnection.playerId()).currentPosition();

        currentConnection.send(new TilesMessage(
            this._kernel.playerArea(player.id()).visibleTilesFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y))
        );
        currentConnection.send(new MoveMessage(currentPosition));

        this._sendToOtherConnectedClients(currentConnection, (connection) => {
            return new CharacterMoveMessage(currentConnection.playerId(), currentPosition)
        });
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleMessage(packet, currentConnection)
    {
        this._sendToOtherConnectedClients(currentConnection, (connection) => {
            return new CharacterSayMessage(currentConnection.playerId(), packet.data.message)
        });
    }

    /**
     * @param {function} messageFactory
     * @private
     */
    _sendToAllConnectedClients(messageFactory)
    {
        for (let connection of this._connections.values()) {
            if (!connection.hasPlayerId()) {
                continue;
            }

            connection.send(messageFactory(connection));
        }
    }

    /**
     * @param {Connection} currentConnection
     * @param {function} messageFactory
     * @private
     */
    _sendToOtherConnectedClients(currentConnection, messageFactory)
    {
        for (let connection of this._connections.values()) {
            if (connection.id() === currentConnection.id()) {
                continue;
            }

            if (!connection.hasPlayerId()) {
                continue;
            }

            connection.send(messageFactory(connection));
        }
    }
}