'use strict';

const Assert = require('assert-js');
const ExperienceCalculator = require('./../Common/ExperienceCalculator');
const AbsolutePosition = require('./AbsolutePosition');
const Directions = require('./Directions');

class Player
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
        this._experience = 0;
        this._level = 1;
        this._health = health;
        this._maxHealth = maxHealth;
        this._moveFrom = new AbsolutePosition(x, y);
        this._position = new AbsolutePosition(x, y);
        this._moveEnds = new Date().getTime();
        this._moveTime = 0;
        this._attackedBy = new Map();
        this._targetId = null;
        this._direction = Directions.DOWN;
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
     * @returns {AbsolutePosition}
     */
    get position()
    {
        return this._position;
    }

    /**
     * @returns {AbsolutePosition}
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
     * @returns {int}
     */
    get direction()
    {
        return this._direction;
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
        return this._position.isEqual(new AbsolutePosition(x, y));
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

        let newPosition = new AbsolutePosition(x, y);

        this._direction = this._position.direction(newPosition);
        this._moveTime = moveTime;
        this._moveFrom = this._position;
        this._position = newPosition;
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

    /**
     * @param {int} experience
     * @param {ExperienceCalculator} calculator
     */
    earnExperience(experience, calculator)
    {
        Assert.integer(experience);
        Assert.instanceOf(calculator, ExperienceCalculator);

        this._experience = this._experience + experience;
        this._level = calculator.level(this._experience);
    }
}

module.exports = Player;