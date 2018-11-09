'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/NetworkMessage');
const ServerMessages = require('./../../Common/ServerMessages');

class LogoutMessage extends Message
{
    /**
     * @param {string} reasonMessage
     */
    constructor(reasonMessage)
    {
        super();

        Assert.string(reasonMessage);

        this._name = ServerMessages.LOGOUT;
        this._data = {
            reason: reasonMessage
        };
    }
}

module.exports = LogoutMessage;