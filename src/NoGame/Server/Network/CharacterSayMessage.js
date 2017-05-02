'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/Network/Message');
const Player = require('./../../Engine/Player');
const Position = require('./../../Engine/Map/Area/Position');
const ServerMessages = require('./../../Common/Network/ServerMessages');

class CharacterSayMessage extends Message
{
    /**
     * @param {string} characterId
     * @param {string} message
     */
    constructor(characterId, message)
    {
        super();

        Assert.string(characterId);
        Assert.string(message);

        this._name = ServerMessages.CHARACTER_SAY;
        this._data = {
            id: characterId,
            message: message
        };
    }
}

module.exports = CharacterSayMessage;