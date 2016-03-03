'use strict';

import Assert from 'assert-js';
import Message from '../../Common/Network/Message';

export default class Connection
{
    /**
     * @param {WebSocket} socket
     */
    constructor(socket)
    {
        Assert.instanceOf(socket, WebSocket);
        this._socket = socket;
        this._index = 0;
    }

    /**
     * @param {function} callback
     */
    bindOnMessage(callback)
    {
        Assert.isFunction(callback);

        this._socket.onmessage = (message) => {
            callback(message, this)
        };
    }

    /**
     * @param {function} callback
     */
    bindOnClose(callback)
    {
        Assert.isFunction(callback);

        this._socket.onclose = () => {
            callback(this)
        };
    }

    /**
     * @param {function} callback
     */
    bindOnOpen(callback)
    {
        Assert.isFunction(callback);

        this._socket.onopen = () => {
            callback(this)
        };
    }

    /**
     * @param {Message} message
     * @param callback
     */
    send(message, callback = () => {})
    {

        Assert.instanceOf(message, Message);
        Assert.isFunction(callback);

        message.setIndex(this._index);
        console.log(`Send: ${message.toString().substr(0, 150)}`);
        this._socket.send(message.toString());
        this._index++;
        callback();
    }
}