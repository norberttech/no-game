'use strict';

import Assert from 'assert-js';
import {NetworkMessage} from 'nogame-common';
import {ClientMessages} from 'nogame-common';

export default class LoginMessage extends NetworkMessage
{
    /**
     * @param {string} login
     * @param {string} password
     */
    constructor(login, password)
    {
        super();

        Assert.string(login);
        Assert.string(password);

        this._name = ClientMessages.LOGIN;
        this._data = {login: login, password: password};
    }
}