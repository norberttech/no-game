'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ClientMessages = require('./../../Common/ClientMessages');

class LoginCharacterMessage extends NetworkMessage
{
    /**
     * @param {string} characterId
     */
    constructor(characterId)
    {
        super();

        Assert.string(characterId);

        this._name = ClientMessages.LOGIN_CHARACTER;
        this._data = {characterId: characterId};
    }
}

module.exports = LoginCharacterMessage;