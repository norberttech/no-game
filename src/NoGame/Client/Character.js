'use strict';

import Position from './Position';
import Assert from 'assert-js';

export default class Character
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} x
     * @param {int} y
     * @param {int} health
     * @param {int} maxHealth
     * @param {int} type
     */
    constructor(id, name, x, y, health, maxHealth, type)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.string(id);
        Assert.string(name);
        Assert.integer(type);

        this._id = id;
        this._name = name;
        this._type = type;
        this._moves = [];
        this._moveFrom = new Position(x, y);
        this._position = new Position(x, y);
        this._moveTime = 0;
        this._moveEnds = new Date().getTime();
        this._health = health;
        this._maxHealth = maxHealth;
    }

    /**
     * @returns {string}
     */
    get id()
    {
        return this._id;
    }

    /**
     * @returns {int}
     */
    get type()
    {
        return this._type
    }

    /**
     * @returns {boolean}
     */
    get isMonster()
    {
        return this._type === 2;
    }

    /**
     * @returns {int}
     */
    get health()
    {
        return this._health;
    }

    /**
     * @param {int} newHealth
     */
    changeHealth(newHealth)
    {
        Assert.integer(newHealth);

        this._health = newHealth;
    }

    /**
     * @returns {int}
     */
    get maxHealth()
    {
        return this._maxHealth;
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * @returns {boolean}
     */
    get isMoving()
    {
        let isMoving = new Date().getTime() < this._moveEnds;

        if (this._moves.length > 0 && !isMoving) {
            let move = this._moves.shift();

            this._moveFrom = move.moveFrom;
            this._position = move.position;
            this._moveTime = move.moveTime;
            this._moveEnds = move.moveEnds;
        } else {
            return isMoving;
        }

        return new Date().getTime() < this._moveEnds;
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

        if (this._moves.length === 0) {
            this._moveTime = moveTime;
            this._moveFrom = this._position;
            this._position = new Position(x, y);
            this._moveEnds = new Date().getTime() + moveTime;
        } else {
            this._moves.push({
                moveFrom: this._position,
                position: new Position(x, y),
                moveTime: moveTime,
                moveEnds: new Date().getTime() + moveTime
            });
        }
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
}