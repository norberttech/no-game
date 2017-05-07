'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Monster = require('./../../Engine/Monster');
const Position = require('./../../Engine/Map/Area/Position');
const ServerMessages = require('nogame-common').ServerMessages;

class MonsterMoveMessage extends Message
{
    /**
     * @param {Monster} monster
     * @param {Position} fromPosition
     */
    constructor(monster, fromPosition)
    {
        super();

        Assert.instanceOf(monster, Monster);
        Assert.instanceOf(fromPosition, Position);

        this._name = ServerMessages.MONSTER_MOVE;
        this._data = {
            id: monster.id,
            name: monster.name,
            moveTime: monster.moveEnds - new Date(),
            type: 2,
            health: monster.health,
            maxHealth: monster.maxHealth,
            from: {
                x: fromPosition.x,
                y: fromPosition.y
            },
            to: {
                x: monster.position.x,
                y: monster.position.y
            }
        };
    }
}

module.exports = MonsterMoveMessage;