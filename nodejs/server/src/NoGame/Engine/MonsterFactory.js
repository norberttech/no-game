'use strict';

const Assert = require('assert-js');
const Monster = require('./Monster');
const Position = require('./Map/Area/Position');
const Clock = require('./Clock');

class MonsterFactory
{
    /**
     * @param {Clock} clock
     */
    constructor(clock)
    {
        Assert.instanceOf(clock, Clock);

        this._monsterTemplates = new Map();
        this._clock = clock;
    }

    /**
     * @param {string} name
     * @param {int} spriteId
     * @param {int} health
     * @param {int} attackPower
     * @param {int} attackDelay
     * @param {int} defence
     */
    addTemplate(name, spriteId, health, attackPower, attackDelay, defence)
    {
        Assert.string(name);
        Assert.integer(spriteId);
        Assert.greaterThan(0, health);
        Assert.greaterThan(0, attackPower);
        Assert.greaterThan(0, attackDelay);

        this._monsterTemplates.set(name, {
            spriteId: spriteId,
            health: health,
            attackPower: attackPower,
            attackDelay: attackDelay,
            defence: defence
        });
    }

    /**
     * @param {string} name
     * @param {Position} position
     * @param spawnId
     * @return Monster
     */
    create(name, position, spawnId)
    {
        Assert.string(name);
        Assert.instanceOf(position, Position);
        Assert.string(spawnId);

        if (!this._monsterTemplates.has(name)) {
            throw `Monster "${name}" does not have valid template.`;
        }

        let template = this._monsterTemplates.get(name);

        return new Monster(
            name,
            template.health,
            template.attackPower,
            template.attackDelay,
            template.defence,
            template.spriteId,
            position,
            spawnId,
            this._clock
        );
    }
}

module.exports = MonsterFactory;