'use strict';

import Assert from 'assert-js'
import Monster from './Monster';
import Position from './Map/Area/Position';

export default class MonsterFactory
{
    constructor()
    {
        this._monsterTemplates = new Map();
    }

    /**
     * @param {string} name
     * @param {int} spriteId
     * @param {int} health
     */
    addTemplate(name, spriteId, health)
    {
        Assert.string(name);
        Assert.integer(spriteId);
        Assert.greaterThan(0, health);

        this._monsterTemplates.set(name, {
            spriteId: spriteId,
            health: health
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
            template.spriteId,
            position,
            spawnId
        );
    }
}