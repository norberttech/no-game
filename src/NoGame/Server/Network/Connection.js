'use strict';

import Assert from './../../../JSAssert/Assert';
import WebSocket from 'ws/lib/WebSocket';
import Utils from './../../Common/Utils';
import Message from '../../Common/Network/Message';
import UUID from 'uuid';

export default class Connection
{
    /**
     * @param {WebSocket} socket
     * @param {boolean} emulateLags
     */
    constructor(socket, emulateLags = false)
    {
        Assert.instanceOf(socket, WebSocket);
        Assert.boolean(emulateLags);

        this._socket = socket;
        this._playerId = null;
        this._id = UUID.v4();
        this._emulateLags = emulateLags;
        this._index = 0;

        console.log(`Connection ${this.id()} open.`);
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
            console.log(`Received: ${message.substr(0, 150)}`);
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
            console.log(`Connection ${this.id()} closed.`);
            callback(this)
        });
    }

    /**
     * @param {Message} message
     */
    send(message)
    {
        Assert.instanceOf(message, Message);

        if (this._emulateLags) {
            Utils.sleep(Utils.randomRange(0, 100));
        }

        message.setIndex(this._index);
        console.log(`Send: ${message.toString().substr(0, 150)}`);
        this._socket.send(message.toString());
        this._index++;
    }
}