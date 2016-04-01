'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class LogoutMessage extends Message
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