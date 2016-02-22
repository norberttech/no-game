'use strict';

import Message from './MessageQueue/Message';

export default class MessageQueue
{
    constructor()
    {
        this._packet = [];
    }

    addMessage(rawMessage, connection)
    {
        let message = JSON.parse(rawMessage);

        this._packet.push(new Message(message, connection));
    }

    /**
     * @returns {Message[]}
     */
    flushMessages()
    {
        let messages = this._packet;

        this._packet = [];

        return messages;
    }
}