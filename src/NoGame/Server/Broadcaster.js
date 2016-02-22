'use strict';

import Connection from './Network/Connection';
import Area from './../Engine/Map/Area';
import Assert from './../../JSAssert/Assert';

export default class Broadcaster
{
    constructor()
    {
        this._connections = new Map();
    }

    /**
     * @param {Connection} connection
     */
    addConnection(connection)
    {
        Assert.instanceOf(connection, Connection);

        this._connections.set(connection.id(), connection);
    }

    /**
     * @param {string} id
     */
    removeConnection(id)
    {
        Assert.string(id);

        this._connections.delete(id);
    }

    /**
     * Send message only to players visible by player with id playerId
     *
     * @param {Area} area;
     * @param {string} playerId
     * @param {int} rangeX
     * @param {int} rangeY
     * @param {function} messageFactory
     */
    sendToPlayersInRange(area, playerId, rangeX, rangeY, messageFactory)
    {
        let visiblePlayers = area.visiblePlayersFor(playerId, rangeX, rangeY);

        for (let connection of this._connections.values()) {
            if (!connection.hasPlayerId()) {
                continue;
            }

            if (connection.playerId() === playerId) {
                continue;
            }

            for (let player of visiblePlayers) {
                if (connection.playerId() === player.id()) {
                    connection.send(messageFactory(connection));
                }
            }
        }
    }

    /**
     * Send message to all connected clients with logged players except currentConnection
     *
     * @param {Connection} currentConnection
     * @param {function} messageFactory
     */
    sendToOtherConnectedClients(currentConnection, messageFactory)
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

    /**
     * Send message to all connected clients
     *
     * @param {function} messageFactory
     */
    sendToAllConnectedClients(messageFactory)
    {
        for (let connection of this._connections.values()) {
            if (!connection.hasPlayerId()) {
                continue;
            }

            connection.send(messageFactory(connection));
        }
    }
}