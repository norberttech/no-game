'use strict';

import Assert from 'assert-js';
import NetworkMessage from './../../Common/NetworkMessage';
import ClientMessages from './../../Common/ClientMessages';

export default class SayMessage extends NetworkMessage
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