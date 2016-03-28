'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Monster from './../../Engine/Monster';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class MonsterAttackMessage extends Message
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