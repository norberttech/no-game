'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const ServerMessages = require('nogame-common').ServerMessages;

class CharacterDiedMessage extends Message
{
    /**
     * @param {string} characterId
     */
    constructor(characterId)
    {
        super();

        Assert.string(characterId);

        this._name = ServerMessages.CHARACTER_DIED;
        this._data = {
            id: characterId
        };
    }
}

module.exports = CharacterDiedMessage;