'use strict';

import Assert from 'assert-js';
import {ExperienceCalculator} from 'nogame-common';
import Position from './Position';

export default class Player
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} experience
     * @param {int} health
     * @param {int} maxHealth
     * @param {int} x
     * @param {int} y
     */
    constructor(id, name, experience, health, maxHealth, x, y)
    {
        Assert.string(id);
        Assert.string(name);
        Assert.integer(experience);
        Assert.greaterThan(0, health);
        Assert.greaterThan(0, maxHealth);
        Assert.integer(x);
        Assert.integer(y);

        this._id = id;
        this._name = name;
        this._experience = experience;
        this._level = ExperienceCalculator.level(experience);
        this._health = health;
        this._maxHealth = maxHealth;
        this._moveFrom = new Position(x, y);
        this._position = new Position(x, y);
        this._moveEnds = new Date().getTime();
        this._moveTime = 0;
        this._attackedBy = new Map();
        this._targetId = null;
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
    get name()
    {
        return this._name;
    }

    get experience()
    {
        return this._experience;
    }

    get level()
    {
        return this._level;
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
     * @returns {boolean}
     */
    get isAttacking()
    {
        return this._targetId !== null;
    }

    /**
     * @returns {null|string}
     */
    get targetId()
    {
        return this._targetId;
    }

    /**
     * @returns {Position}
     */
    get position()
    {
        return this._position;
    }

    /**
     * @returns {Position}
     */
    get movingFromPosition()
    {
        return this._moveFrom;
    }

    /**
     * @returns {boolean}
     */
    get isMoving()
    {
        return new Date().getTime() < this._moveEnds;
    }

    /**
     * @param {string} characterId
     */
    attack(characterId)
    {
        Assert.string(characterId);

        this._targetId = characterId;
    }

    /**
     * @param {int} newValue
     */
    changeHealth(newValue)
    {
        Assert.integer(newValue);

        this._health = newValue;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    isMovingTo(x, y)
    {
        return this._position.isEqual(new Position(x, y));
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
        this._moveFrom = this._position;
        this._position = new Position(x, y);
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
        this._position = this._moveFrom;
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