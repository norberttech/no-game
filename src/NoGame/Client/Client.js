'use strict';

import Assert from './../../JSAssert/Assert';
import Kernel from './Kernel';
import Messages from './../Server/Network/Messages';
import LoginMessage from './Network/LoginMessage';

export default class Client
{
    /**
     * @param {string} serverAddress
     * @param {Kernel} kernel
     */
    constructor(serverAddress, kernel)
    {
        Assert.string(serverAddress);
        Assert.instanceOf(kernel, Kernel);

        this._kernel = kernel;
        this._serverAddress = serverAddress;
        this._isConnected = false;
    }

    /**
     * @param {function} onConnect
     */
    connect(onConnect)
    {
        Assert.isFunction(onConnect);

        this._connection = new WebSocket(
            this._serverAddress,
            "ws"
        );

        this._connection.onopen = () => {
            this._kernel.boot();
            onConnect(this);
            this._isConnected = true;
        };

        this._connection.onmessage = (event) => {
            let message = JSON.parse(event.data);

            switch (message.name) {
                case Messages.LOGIN:
                    this._kernel.draw();
                    this._kernel.setUserId(message.data.id);
                    break;
                case Messages.AREA:
                    // message.data.name
                    // message.data.tiles
                    break;
            }

            console.log(message);
        };
    }

    /**
     * @param {function} callback
     */
    onDisconnect(callback)
    {
        Assert.isFunction(callback);

        this._connection.onclose = () => {
            callback(this);
            this._isConnected = false;
        }
    }

    /**
     * @param {string} username
     */
    login(username)
    {
        Assert.string(username);

        if (this._isConnected) {
            this._connection.send(new LoginMessage(username).toString());
        }
    }
}