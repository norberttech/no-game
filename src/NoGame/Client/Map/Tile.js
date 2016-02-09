'use strict';

import Assert from './../../../JSAssert/Assert';

export default class Tile
{
    /**
     * @param {integer} x
     * @param {integer} y
     * @param {boolean} canWalkOn
     * @param {array} stack
     */
    constructor(x, y, canWalkOn, stack)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.boolean(canWalkOn);
        Assert.array(stack);

        this._x = x;
        this._y = y;
        this._canWalkOn = canWalkOn;
        this._stack = stack;
    }

    /**
     * @returns {integer}
     */
    x()
    {
        return this._x;
    }

    /**
     * @returns {integer}
     */
    y()
    {
        return this._y;
    }

    /**
     * @returns {string}
     */
    toString()
    {
        return `${this._x}:${this._y}`;
    }

    /**
     * @returns {boolean}
     */
    canWalkOn()
    {
        return this._canWalkOn;
    }

    /**
     * @returns {array}
     */
    stack()
    {
        return this._stack;
    }
}