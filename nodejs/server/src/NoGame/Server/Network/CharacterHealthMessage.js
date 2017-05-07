'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const ServerMessages = require('nogame-common').ServerMessages;

class CharacterHealthMessage extends Message
{
    /**
     * @param {string} characterId
     * @param {int} oldValue
     * @param {int} newValue
     */
    constructor(characterId, oldValue, newValue)
    {
        super();

        Assert.integer(oldValue);
        Assert.integer(newValue);

        this._name = ServerMessages.CHARACTER_HEALTH;
        this._data = {
            id: characterId,
            oldValue: oldValue,
            newValue: newValue
        };
    }
}

module.exports = CharacterHealthMessage;