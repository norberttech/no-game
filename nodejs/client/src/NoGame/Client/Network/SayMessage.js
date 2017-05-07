'use strict';

import Assert from 'assert-js';
import {NetworkMessage} from 'nogame-common';
import {ClientMessages} from 'nogame-common';

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