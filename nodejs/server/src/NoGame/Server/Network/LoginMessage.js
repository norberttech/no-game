'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Player = require('./../../Engine/Player');
const ServerMessages = require('nogame-common').ServerMessages;

class LoginMessage extends Message
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        super();

        Assert.instanceOf(player, Player);

        this._name = ServerMessages.LOGIN;
        this._data = {
            id: player.id,
            experience: player.experience,
            name: player.name,
            health: player.health,
            maxHealth: player.maxHealth,
            position: {
                x: player.position.x,
                y: player.position.y
            }
        };
    }
}

module.exports = LoginMessage;