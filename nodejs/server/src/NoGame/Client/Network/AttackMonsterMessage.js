'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import ClientMessages from './../../Common/Network/ClientMessages';

export default class AttackMonsterMessage extends Message
{
    /**
     * @param {string} monsterId
     */
    constructor(monsterId)
    {
        super();

        Assert.string(monsterId);

        this._name = ClientMessages.ATTACK_MONSTER;
        this._data = {id: monsterId};
    }
}