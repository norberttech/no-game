'use strict';

import IncomeMessage from './IncomeMessage';

export default class IncomeQueue
{
    constructor()
    {
        this._packet = [];
    }

    addMessage(rawMessage, connection)
    {
        let message = JSON.parse(rawMessage);

        this._packet.push(new IncomeMessage(message, connection));
    }

    /**
     * @returns {IncomeMessage[]}
     */
    flushMessages()
    {
        let messages = this._packet;

        this._packet = [];

        return messages;
    }
}