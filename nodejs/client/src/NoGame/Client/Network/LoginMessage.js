'use strict';

import Assert from 'assert-js';
import NetworkMessage from './../../Common/NetworkMessage';
import ClientMessages from './../../Common/ClientMessages';
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