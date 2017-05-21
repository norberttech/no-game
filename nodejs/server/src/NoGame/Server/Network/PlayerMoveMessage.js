'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Player = require('./../../Engine/Player');
const ServerMessages = require('nogame-common').ServerMessages;

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