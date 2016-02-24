'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class BatchMessage extends Message
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