'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Player = require('./../../Engine/Player');
const Position = require('./../../Engine/Map/Area/Position');
const ServerMessages = require('nogame-common').ServerMessages;

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