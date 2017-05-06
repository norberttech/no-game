'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/Network/Message');
const ServerMessages = require('./../../Common/Network/ServerMessages');

class BatchMessage extends Message
{
    constructor(messages)
    {
        super();
        Assert.containsOnly(messages, Message);

        this._name = ServerMessages.BATCH_MESSAGE;
        this._data = {
            messages: messages.map(function(message) {
                return message.toString();
            })
        };
    }
}

module.exports = BatchMessage;