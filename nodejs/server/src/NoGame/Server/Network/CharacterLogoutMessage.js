'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/Network/Message');
const ServerMessages = require('./../../Common/Network/ServerMessages');

class CharacterLogoutMessage extends Message
{
    /**
     * @param {string} playerId
     */
    constructor(playerId)
    {
        super();

        Assert.string(playerId);

        this._name = ServerMessages.CHARACTER_LOGOUT;
        this._data = {
            id: playerId
        };
    }
}

module.exports = CharacterLogoutMessage;