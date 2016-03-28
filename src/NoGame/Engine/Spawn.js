'use strict';

import UUID from 'uuid';
import Assert from 'assert-js'
import Position from './Map/Area/Position'
import Utils from './../Common/Utils';

export default class Spawn
{
    /**
     * @param {string} monsterName
     * @param {int} maxSize
     * @param {int} spawnDuration - in seconds
     * @param {Position} centerPosition
     * @param {int} radius
     */
    constructor(monsterName, maxSize, spawnDuration, centerPosition, radius)
    {
        Assert.string(monsterName);
        Assert.greaterThan(0, maxSize);
        Assert.greaterThan(0, spawnDuration);
        Assert.instanceOf(centerPosition, Position);
        Assert.greaterThan(0, radius);

        this._id = UUID.v4();
        this._monsterName = monsterName;
        this._maxSize = maxSize;
        this._spawnDuration = spawnDuration;
        this._lastSpawnDate = 0;
        this._monsters = new Map();
        this._centerPosition = centerPosition;
        this._radius = radius;
    }

    /**
     * @returns {string}
     */
    get id()
    {
        return this._id;
    }

    /**
     * @returns {string}
     */
    get monsterName()
    {
        return this._monsterName;
    }

    /**
     * @returns {boolean}
     */
    get isFull()
    {
        return this._monsters.size >= this._maxSize;
    }

    /**
     * @returns {boolean}
     */
    get canSpawn()
    {
        return new Date().getTime() >= this._lastSpawnDate + this._spawnDuration;
    }

    /**
     * @returns {Position}
     */
    get randomPosition()
    {
        let x = Utils.randomRange(this._centerPosition.x() - this._radius, this._centerPosition.x() + this._radius);
        let y = Utils.randomRange(this._centerPosition.y() - this._radius, this._centerPosition.y() + this._radius);

        return new Position(x, y);
    }

    /**
     * @returns {Monster[]}
     */
    get monsters()
    {
        return Array.from(this._monsters.values());
    }

    /**
     * @returns {Position}
     */
    get position()
    {
        return this._centerPosition;
    }

    /**
     * @param {MonsterFactory} factory
     * @param {Position} position
     * @param {string} spawnId
     */
    spawnMonster(factory, position, spawnId)
    {
        Assert.instanceOf(position, Position);

        if (this.isFull) {
            throw `Spawn ${this._id} for "${this._monsterName}" is full.`;
        }

        if (!this.canSpawn) {
            throw `Spawn ${this._id} for "${this._monsterName}" is not ready for new monster yet.`;
        }

        let monster = factory.create(this._monsterName, position, spawnId);

        this._monsters.set(monster.id, monster);
        this._lastSpawnDate = new Date().getTime();

        return monster;
    }

    /**
     * @param {string} monsterId
     */
    getMonster(monsterId)
    {
        Assert.string(monsterId);

        if (!this._monsters.has(monsterId)) {
            throw `Spawn ${this._id} does not have monster with id "${monsterId}".`;
        }

        return this._monsters.get(monsterId);
    }
}