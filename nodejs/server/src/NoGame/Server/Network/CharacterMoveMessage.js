'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Player = require('./../../Engine/Player');
const Position = require('./../../Engine/Map/Area/Position');
const ServerMessages = require('nogame-common').ServerMessages;

class CharacterMoveMessage extends Message
{
    /**
     * @param {Player} player
     * @param {Position} fromPosition
     */
    constructor(player, fromPosition)
    {
        super();

        Assert.instanceOf(fromPosition, Position);
        Assert.instanceOf(player, Player);

        this._name = ServerMessages.CHARACTER_MOVE;
        this._data = {
            id: player.id,
            name: player.name,
            moveTime: player.moveEnds - new Date(),
            type: 1,
            health: player.health,
            maxHealth: player.maxHealth,
            from: {
                x: fromPosition.x,
                y: fromPosition.y
            },
            to: {
                x: player.position.x,
                y: player.position.y
            }
        };
    }
}

module.exports = CharacterMoveMessage;