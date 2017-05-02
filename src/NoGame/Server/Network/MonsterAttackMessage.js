'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/Network/Message');
const Monster = require('./../../Engine/Monster');
const ServerMessages = require('./../../Common/Network/ServerMessages');

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