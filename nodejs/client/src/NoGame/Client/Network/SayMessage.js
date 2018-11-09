'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ClientMessages = require('./../../Common/ClientMessages');

class SayMessage extends NetworkMessage
{
    /**
     * @param {string} message
     */
    constructor(message)
    {
        super();

        Assert.string(message);

        this._name = ClientMessages.MESSAGE;
        this._data = {message: message};
    }
}

module.exports = SayMessage;