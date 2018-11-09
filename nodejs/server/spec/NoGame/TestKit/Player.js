'use strict';

const WebSocket = require('ws');
const Assert = require('assert-js');

class Player
{
    constructor()
    {
        this._isConnected = false;
        this._connection = null;
        this._messages = [];
        this._messageExpectation = [];
        this._disconnectExpectation = null;
    }

    /**
     * @param {string} host
     * @param {function} [callback]
     */
    connect(host, callback = () => {})
    {
        Assert.string(host);
        Assert.isFunction(callback);

        this._connection = new WebSocket(host, [], {});

        this._connection.onopen = () => {
            this._isConnected = true;
            callback();
        };

        this._connection.onclose = () => {
            this._isConnected = false;

            if (this._disconnectExpectation !== null && !this._disconnectExpectation.done) {
                clearTimeout(this._disconnectExpectation.timer);
                this._disconnectExpectation.callback()
            }
        };

        this._connection.onmessage = (event) => {
            let index = this._messages.length;

            this._messages[index] = event.data;

            if (this._messageExpectation.hasOwnProperty(index) && !this._messageExpectation[index].done) {
                this._messageExpectation[index].done = true;
                clearTimeout(this._messageExpectation[index].timer);
                this._messageExpectation[index].callback(this._messages[index]);
            }
        };

        this._connection.onerror = (event) => {
            console.log('ERRROR');
            console.log(event);
            process.exit(1);
        }
    }

    /**
     * @param {string} message
     */
    send(message)
    {
        Assert.string(message);

        if (!this._isConnected) {
            throw Error(`Player not connected, can't send message`);
        }

        this._connection.send(message);
    }

    disconnect()
    {
        this._connection.close();
        this._messageExpectation.map((expectation) => {
            clearTimeout(expectation.timer);
        });
        if (this._disconnectExpectation !== null && !this._disconnectExpectation.done) {
            clearTimeout(this._disconnectExpectation.timer);
        }
    }

    /**
     * @param {function} callback
     * @param {int} [duration]
     */
    expectMsg(callback, duration = 2000)
    {
        Assert.isFunction(callback);
        Assert.integer(duration);

        let index = this._messageExpectation.length;

        this._messageExpectation[index] = {
            done: false,
            callback: callback,
            timer: setTimeout(() => {
                throw Error(`Expected message "${index}" never received.`);
            }, duration)
        };

        if (this._messages.length > 0 && this._messages.hasOwnProperty(index) && !this._messageExpectation[index].done){
            this._messageExpectation[index].done = true;
            clearTimeout(this._messageExpectation[index].timer);
            this._messageExpectation[index].callback(this._messages[index]);
        }
    }

    /**
     * @param {function} callback
     * @param {int} duration
     */
    expectDisconnection(callback, duration = 2000)
    {
        Assert.isFunction(callback);
        Assert.integer(duration);

        this._disconnectExpectation = {
            done: false,
            callback: callback,
            timer: setTimeout(() => {
                throw Error(`Expected disconnection but player was never never disconnected.`);
            }, duration)
        }
    }

    /**
     * @returns {boolean}
     */
    get connected()
    {
        return this._isConnected;
    }
}

module.exports = Player;