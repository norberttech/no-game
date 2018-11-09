'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ClientMessages = require('./../../Common/ClientMessages');

class MoveMessage extends NetworkMessage
{
    /**
     * @param {int} x
     * @param {int} y
     */
    constructor(x, y)
    {
        super();

        Assert.integer(x);
        Assert.integer(y);

        this._name = ClientMessages.MOVE;
        this._data = {
            x: x,
            y: y
        };
    }
}

module.exports = MoveMessage;