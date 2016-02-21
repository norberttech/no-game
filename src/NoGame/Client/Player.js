'use strict';

import Position from './Position';
import Assert from './../../JSAssert/Assert';

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
        this._positon = new Position(x, y);
        this._movingTo = new Position(x, y);
    }

    /**
     * @param {Position} position
     */
    movingTo(position)
    {
        this._movingTo = position;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    isMovingTo(x, y)
    {
        return this._movingTo.isEqual(new Position(x, y));
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
        return !this._movingTo.isEqual(this._positon);
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    move(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._positon = new Position(x, y);
        this._movingTo = this._positon;
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
    position()
    {
        return this._positon;
    }
}