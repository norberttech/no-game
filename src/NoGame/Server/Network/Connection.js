'use strict';

import Assert from 'assert-js';
import WebSocket from 'ws/lib/WebSocket';
import Logger from './../../Common/Logger';
import Message from '../../Common/Network/Message';
import UUID from 'uuid';

export default class Connection
{
    /**
     * @param {WebSocket} socket
     * @param {Logger} logger
     */
    constructor(socket, logger)
    {
        Assert.instanceOf(socket, WebSocket);
        Assert.instanceOf(logger, Logger);

        this._socket = socket;
        this._playerId = null;
        this._id = UUID.v4();
        this._index = 0;
        this._logger = logger;
        this._logReceived('Connection open');
    }

    /**
     * @returns {string}
     */
    get id()
    {
        return this._id;
    }

    removePlayer()
    {
        this._playerId = null;
    }

    /**
     * @param {string} id
     */
    setPlayerId(id)
    {
        Assert.string(id);

        this._playerId = id;
    }

    /**
     * @returns {null|string}
     */
    get playerId()
    {
        return this._playerId;
    }

    /**
     * @returns {boolean}
     */
    get hasPlayerId()
    {
        return this._playerId !== null;
    }

    /**
     * @param {function} callback
     */
    bindOnMessage(callback)
    {
        Assert.isFunction(callback);

        this._socket.on('message', (message) => {
            this._logReceived(message);
            callback(message, this)
        });
    }

    /**
     * @param {function} callback
     */
    bindOnClose(callback)
    {
        Assert.isFunction(callback);

        this._socket.on('close', () => {
            this._logReceived('Connection closed.');
            callback(this)
        });
    }

    /**
     * @param {Message} message
     */
    send(message)
    {
        Assert.instanceOf(message, Message);

        message.setIndex(this._index);
        this._logSend(message);
        this._socket.send(message.toString());
        this._index++;
    }

    _logSend(entry)
    {
        this._logger.debug({
            direction: 'send',
            entry: entry,
            connection: {
                id: this._id
            }
        })
    }

    _logReceived(entry)
    {
        this._logger.debug({
            direction: 'received',
            entry: entry,
            connection: {
                id: this._id
            }
        })
    }
}