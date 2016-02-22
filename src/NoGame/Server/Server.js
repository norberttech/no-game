'use strict';

import ws from 'ws';
import Broadcaster from './Broadcaster';
import Connection from './Network/Connection';
import BatchMessage from './Network/BatchMessage';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';
import TilesMessage from './Network/TilesMessage';
import MoveMessage from './Network/MoveMessage';
import MessageQueue from './MessageQueue';
import CharactersMessage from './Network/CharactersMessage';
import CharacterMoveMessage from './Network/CharacterMoveMessage';
import CharacterSayMessage from './Network/CharacterSayMessage';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';
import Player from './../Engine/Player';
import Position from './../Engine/Map/Area/Position';
import ClientMessages from './../Common/Network/ClientMessages'
import GameLoop from './GameLoop';

/**
 * Client displays x: 15 and y: 11 but it keeps 2 tiles hidden.
 *
 * @type {{x: number, y: number}}
 */
const VISIBLE_TILES = {x: 17, y: 13};

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
        this._broadcaster = new Broadcaster();
        this._messageQueue = new MessageQueue();
        this._gameLoop = new GameLoop(1000 / 45, this.update.bind(this));
    }

    /**
     * @param {integer} port
     */
    listen(port = 8080)
    {
        Assert.integer(port);

        let onConnection = (socket) => {
            let connection = new Connection(socket, this._debug);

            connection.bindOnMessage(this.onMessage.bind(this));
            connection.bindOnClose(this.onClose.bind(this));

            this._broadcaster.addConnection(connection);
        };

        this._gameLoop.start();
        this._server = ws.createServer({ port: port, verifyClient: !this._debug}, onConnection);
    }

    /**
     * @param {string} rawMessage
     * @param {Connection} currentConnection
     */
    onMessage(rawMessage, currentConnection)
    {
        this._messageQueue.addMessage(rawMessage, currentConnection);
    }

    update()
    {
        let messages = this._messageQueue.flushMessages();

        for (let message of messages) {
            let packet = message.getPacket();

            switch (packet.name) {
                case ClientMessages.LOGIN:
                    this._handleLogin(packet, message.getConnection());
                    break;
                case ClientMessages.MOVE:
                    this._handleMove(packet, message.getConnection());
                    break;
                case ClientMessages.MESSAGE:
                    this._handleMessage(packet, message.getConnection());
                    break;
                default:
                    console.log("Unhandled message");
                    console.log(message);
                    break;
            }
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
            this._broadcaster.sendToOtherConnectedClients(closedConnection, (connection) => {
                return new CharactersMessage(
                    this._kernel.playerArea(connection.playerId())
                        .visiblePlayersFor(connection.playerId(), VISIBLE_TILES.x, VISIBLE_TILES.y)
                )
            });
        }

        this._broadcaster.removeConnection(closedConnection.id());
    }

    /**
     * @param {object} packet
     * @param {Connection} connection
     * @private
     */
    _handleLogin(packet, connection)
    {
        let player = new Player(packet.data.username);
        this._kernel.login(player);
        let area = this._kernel.playerArea(player.id());
        let messagesBatch = [];

        connection.setPlayerId(player.id());

        messagesBatch.push(new LoginMessage(player));
        messagesBatch.push(new AreaMessage(area.name(), VISIBLE_TILES.x, VISIBLE_TILES.y));
        messagesBatch.push(new TilesMessage(
            area.visibleTilesFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y))
        );
        messagesBatch.push(
            new CharactersMessage(
                area.visiblePlayersFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y)
            )
        );

        connection.send(new BatchMessage(messagesBatch));

        this._broadcaster.sendToPlayersInRange(area, player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y, (playerConnection) => {
            return new CharactersMessage(
                area.visiblePlayersFor(playerConnection.playerId(), VISIBLE_TILES.x, VISIBLE_TILES.y)
            )
        })
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleMove(packet, currentConnection)
    {
        let area = this._kernel.playerArea(currentConnection.playerId());
        let toPosition = new Position(packet.data.x, packet.data.y);
        let player = area.player(currentConnection.playerId());
        let fromPosition = player.currentPosition();

        if (player.isMoving()) {
            currentConnection.send(new MoveMessage(player));
            return;
        }

        if (player.currentPosition().isEqualTo(toPosition)) {
            currentConnection.send(new MoveMessage(player));
            return ;
        }

        try {
            area.movePlayerTo(currentConnection.playerId(), toPosition);
        } catch (error) {
            currentConnection.send(new MoveMessage(player));
            return ;
        }

        let messages = [];
        messages.push(new MoveMessage(player));
        messages.push(new TilesMessage(
            area.visibleTilesFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y))
        );
        currentConnection.send(new BatchMessage(messages));

        this._broadcaster.sendToPlayersInRange(area, player.id(), VISIBLE_TILES.x + 2, VISIBLE_TILES.y + 2, () => {
            return new CharacterMoveMessage(player, fromPosition);
        });
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleMessage(packet, currentConnection)
    {
        this._broadcaster.sendToOtherConnectedClients(currentConnection, () => {
            return new CharacterSayMessage(currentConnection.playerId(), packet.data.message)
        });
    }
}