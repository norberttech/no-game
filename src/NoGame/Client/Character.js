'use strict';

import Position from './Position';
import Assert from './../../JSAssert/Assert';

export default class Character
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
        this._position = new Position(x, y);
        this._moveTime = 0;
        this._moveEnds = new Date().getTime();
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
    getName()
    {
        return this._name;
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
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

        this._moveTime = moveTime;
        this._moveFrom = this._position;
        this._position = new Position(x, y);
        this._moveEnds = new Date().getTime() + moveTime;
    }


    /**
     * @returns {Position}
     */
    getCurrentPosition()
    {
        return this._position;
    }

    /**
     * @returns {Position}
     */
    getMovingFromPosition()
    {
        return this._moveFrom;
    }
}