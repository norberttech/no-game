'use strict';

import Position from './Position';
import Assert from 'assert-js';

export default class Player
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} health
     * @param {int} maxHealth
     * @param {int} x
     * @param {int} y
     */
    constructor(id, name, health, maxHealth, x, y)
    {
        Assert.string(id);
        Assert.string(name);
        Assert.greaterThan(0, health);
        Assert.greaterThan(0, maxHealth);
        Assert.integer(x);
        Assert.integer(y);

        this._id = id;
        this._name = name;
        this._health = health;
        this._maxHealth = maxHealth;
        this._moveFrom = new Position(x, y);
        this._positon = new Position(x, y);
        this._moveEnds = new Date().getTime();
        this._moveTime = 0;
        this._attackedBy = new Map();
    }

    /**
     * @returns {string}
     */
    id()
    {
        return this._id;
    }

    /**
     * @returns {string}
     */
    name()
    {
        return this._name;
    }

    /**
     * @returns {int}
     */
    get health()
    {
        return this._health;
    }

    /**
     * @returns {int}
     */
    get maxHealth()
    {
        return this._maxHealth;
    }

    /**
     * @returns {Position}
     */
    getCurrentPosition()
    {
        return this._positon;
    }

    /**
     * @returns {Position}
     */
    getMovingFromPosition()
    {
        return this._moveFrom;
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
        return new Date().getTime() < this._moveEnds;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    isMovingTo(x, y)
    {
        return this._positon.isEqual(new Position(x, y));
    }

    /**
     * @returns {int}
     */
    getMoveEnds()
    {
        return this._moveEnds;
    }

    /**
     * @returns {int}
     */
    getMoveTime()
    {
        return this._moveTime;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} moveTime
     */
    startMovingTo(x, y, moveTime)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.integer(moveTime);

        this._moveTime = moveTime;
        this._moveFrom = this._positon;
        this._positon = new Position(x, y);
        this._moveEnds = new Date().getTime() + moveTime;
    }

    /**
     * @param moveTime
     */
    updateMoveTime(moveTime)
    {
        this._moveEnds = new Date().getTime() + moveTime;
    }

    cancelMove()
    {
        this._moveEnds = new Date().getTime();
        this._positon = this._moveFrom;
        this._moveTime = 0;
    }

    /**
     * @param {string} characterId
     */
    attackedBy(characterId)
    {
        this._attackedBy.set(characterId, true);
    }

    /**
     * @param {string} characterId
     * @returns {boolean}
     */
    isAttackedBy(characterId)
    {
        return this._attackedBy.has(characterId);
    }

    /**
     * @param {string} characterId
     */
    removeAttacker(characterId)
    {
        if (this.isAttackedBy(characterId)) {
            this._attackedBy.delete(characterId);
        }
    }
}