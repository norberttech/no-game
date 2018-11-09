'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ServerMessages = require('./../../Common/ServerMessages');

class BatchMessage extends NetworkMessage
{
    constructor(messages)
    {
        super();
        Assert.containsOnly(messages, NetworkMessage);

        this._name = ServerMessages.BATCH_MESSAGE;
        this._data = {
            messages: messages.map(function(message) {
                return message.toString();
            })
        };
    }
}

module.exports = BatchMessage;