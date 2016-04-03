'use strict';

import Assert from 'assert-js';
import Message from '../../Common/Network/Message';

export default class Connection
{
    constructor()
    {
        this._index = 0;
        this._socket = null;
    }

    /**
     * @param {string} serverAddress
     * @param {function} onOpen
     * @param {function} onMessage
     */
    open(serverAddress, onOpen, onMessage)
    {
        Assert.string(serverAddress);
        Assert.isFunction(onOpen);
        Assert.isFunction(onMessage)

        this._socket = new WebSocket(serverAddress, "ws");

        this._socket.onopen = () => {
            onOpen(this)
        };

        this._socket.onmessage = (message) => {
            onMessage(message, this)
        };
    }

    /**
     * @param {function} callback
     */
    bindOnClose(callback)
    {
        if (this._socket === null) {
            throw `Socket not connected`;
        }

        Assert.isFunction(callback);

        this._socket.onclose = () => {
            callback()
        };
    }

    /**
     * @param {Message} message
     * @param callback
     */
    send(message, callback = () => {})
    {
        if (this._socket === null) {
            throw `Socket not connected`;
        }

        Assert.instanceOf(message, Message);
        Assert.isFunction(callback);

        message.setIndex(this._index);
        console.log(`Send: ${message.toString().substr(0, 150)}`);
        this._socket.send(message.toString());
        this._index++;
        callback();
    }
}