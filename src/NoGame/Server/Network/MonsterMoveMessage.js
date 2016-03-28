'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Monster from './../../Engine/Monster';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class MonsterMoveMessage extends Message
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
            from: {
                x: fromPosition.x(),
                y: fromPosition.y()
            },
            to: {
                x: monster.position.x(),
                y: monster.position.y()
            }
        };
    }
}