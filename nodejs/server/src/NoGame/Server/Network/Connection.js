'use strict';

const Assert = require('assert-js');
const WebSocket = require('ws');
const Message = require('./../../Common/NetworkMessage');
const Logger = require('./../../Common/Logger');
const UUID = require('uuid');

class Connection
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

        if (this._socket.readyState === WebSocket.OPEN) {
            message.setIndex(this._index);

            this._logSend(message);
            this._socket.send(message.toString(), {}, () => {
                this._index++;
            });
        }
    }

    disconnect()
    {
        this._socket.close(1000, "Connection closed.");
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

module.exports = Connection;