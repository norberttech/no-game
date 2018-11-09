'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/NetworkMessage');
const ServerMessages = require('./../../Common/ServerMessages');

class CharacterParryMessage extends Message
{
    /**
     * @param {string} characterId
     */
    constructor(characterId)
    {
        super();

        Assert.string(characterId);

        this._name = ServerMessages.CHARACTER_PARRY;
        this._data = {
            id: characterId
        };
    }
}

module.exports = CharacterParryMessage;