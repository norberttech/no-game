'use strict';

const Assert = require('assert-js');
const Player = require('./../../Engine/Player');
const Message = require('./../../Common/NetworkMessage');
const ServerMessages = require('./../../Common/ServerMessages');

class PlayerMoveMessage extends Message
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        super();

        Assert.instanceOf(player, Player);

        this._name = ServerMessages.PLAYER_MOVE;
        this._data = {
            x: player.position.x,
            y: player.position.y,
            moveTime: (player.moveEnds === 0) ? 0 : player.moveEnds - new Date()
        };
    }
}

module.exports = PlayerMoveMessage;