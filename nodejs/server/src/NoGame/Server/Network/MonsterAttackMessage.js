'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Monster = require('./../../Engine/Monster');
const ServerMessages = require('nogame-common').ServerMessages;

class MonsterAttackMessage extends Message
{
    /**
     * @param {Monster} monster
     * @param {boolean} attacking
     */
    constructor(monster, attacking)
    {
        super();

        Assert.instanceOf(monster, Monster);
        Assert.boolean(attacking);

        this._name = ServerMessages.MONSTER_ATTACK;
        this._data = {
            id: monster.id,
            attacking: attacking
        };
    }
}

module.exports = MonsterAttackMessage;