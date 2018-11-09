'use strict';

const Assert = require('assert-js');
const Player = require('./../../Engine/Player');
const Message = require('./../../Common/NetworkMessage');
const ServerMessages = require('./../../Common/ServerMessages');

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