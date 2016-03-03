'use strict';

import Position from './Position';
import Assert from 'assert-js';

export default class Player
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} x
     * @param {int} y
     */
    constructor(id, name, x, y)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.string(id);
        Assert.string(name);

        this._id = id;
        this._name = name;
        this._moveFrom = new Position(x, y);
        this._positon = new Position(x, y);
        this._moveEnds = new Date().getTime();
        this._moveTime = 0;
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
}