'use strict';

import Assert from './../../../JSAssert/Assert';
import WebSocket from 'ws/lib/WebSocket';
import Message from '../../Common/Network/Message';
import UUID from 'uuid';

export default class Connection
{
    /**
     * @param {WebSocket} socket
     */
    constructor(socket)
    {
        Assert.instanceOf(socket, WebSocket);
        this._socket = socket;
        this._playerId = null;
        this._id = UUID.v4();
    }

    /**
     * @returns {string}
     */
    id()
    {
        return this._id;
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
    playerId()
    {
        return this._playerId;
    }

    /**
     * @returns {boolean}
     */
    hasPlayerId()
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
            callback(this)
        });
    }

    /**
     * @param {Message} message
     */
    send(message)
    {
        Assert.instanceOf(message, Message);

        this._socket.send(message.toString());
    }
}