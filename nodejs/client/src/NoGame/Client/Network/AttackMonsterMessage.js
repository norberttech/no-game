'use strict';

const Assert = require('assert-js');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ClientMessages = require('./../../Common/ClientMessages');

class AttackMonsterMessage extends NetworkMessage
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

module.exports = AttackMonsterMessage;