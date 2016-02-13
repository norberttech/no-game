'use strict';

import ws from 'ws';
import Connection from './Connection';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';
import MoveMessage from './Network/MoveMessage';
import CharactersMessage from './Network/CharactersMessage';
import CharacterMoveMessage from './Network/CharacterMoveMessage';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';
import Player from './../Engine/Player';
import Position from './../Engine/Map/Area/Position';
import ClientMessages from './../Common/Network/ClientMessages'

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
     * @param {string} rawMessage
     * @param {Connection} currentConnection
     */
    onMessage(rawMessage, currentConnection)
    {
        let message = JSON.parse(rawMessage);

        switch (message.name) {
            case ClientMessages.LOGIN:
                let player = new Player(message.data.username);
                this._kernel.login(player);
                currentConnection.setPlayerId(player.id());
                currentConnection.send(new LoginMessage(player));
                currentConnection.send(new AreaMessage(this._kernel.playerArea(player.id())));

                for (let connection of this._connections.values()) {
                    if (!connection.hasPlayerId()) {
                        continue;
                    }

                    connection.send(new CharactersMessage(
                        this._kernel.playerArea(connection.playerId()).getVisiblePlayersFor(connection.playerId())
                    ));
                }

                break;
            case ClientMessages.MOVE:
                let area = this._kernel.playerArea(currentConnection.playerId());
                let requestedPosition = new Position(message.data.x, message.data.y);

                area.movePlayerTo(currentConnection.playerId(), requestedPosition);

                let currentPosition = area.player(currentConnection.playerId()).currentPosition();

                currentConnection.send(new MoveMessage(currentPosition));

                for (let connection of this._connections.values()) {
                    if (connection.id() === currentConnection.id()) {
                        continue;
                    }

                    if (!connection.hasPlayerId()) {
                        continue;
                    }

                    connection.send(new CharacterMoveMessage(currentConnection.playerId(), currentPosition));
                }

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
            for (let connection of this._connections.values()) {
                if (connection.id() === closedConnection.id()) {
                    continue;
                }

                if (!connection.hasPlayerId()) {
                    continue;
                }

                connection.send(new CharactersMessage(
                    this._kernel.playerArea(connection.playerId()).getVisiblePlayersFor(connection.playerId())
                ));
            }
        }

        this._connections.delete(closedConnection.id());
    }
}