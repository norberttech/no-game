'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class HealthMessage extends Message
{
    /**
     * @param {int} oldValue
     * @param {int} newValue
     */
    constructor(oldValue, newValue)
    {
        super();

        Assert.integer(oldValue);
        Assert.integer(newValue);

        this._name = ServerMessages.HEALTH;
        this._data = {
            oldValue: oldValue,
            newValue: newValue
        };
    }
}