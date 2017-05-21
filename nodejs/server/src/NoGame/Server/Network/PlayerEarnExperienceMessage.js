'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Player = require('./../../Engine/Player');
const ServerMessages = require('nogame-common').ServerMessages;

class PlayerEarnExperienceMessage extends Message
{
    constructor(experience)
    {
        super();

        Assert.integer(experience);

        this._name = ServerMessages.PLAYER_EARN_EXPERIENCE;
        this._data = {
            experience: experience
        };
    }
}

module.exports = PlayerEarnExperienceMessage;