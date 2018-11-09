'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ClientMessages = require('./../../Common/ClientMessages');

class LoginMessage extends NetworkMessage
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

module.exports = LoginMessage;