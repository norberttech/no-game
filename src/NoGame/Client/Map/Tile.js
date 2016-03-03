'use strict';

import Assert from 'assert-js';

export default class Tile
{
    /**
     * @param {int} x
     * @param {int} y
     * @param {boolean} canWalkOn
     * @param {array} stack
     * @param {int} moveSpeedModifier
     */
    constructor(x, y, canWalkOn, stack, moveSpeedModifier)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.boolean(canWalkOn);
        Assert.array(stack);
        Assert.integer(moveSpeedModifier);

        this._x = x;
        this._y = y;
        this._canWalkOn = canWalkOn;
        this._stack = stack;
        this._moveSpeedModifier = moveSpeedModifier;
    }

    /**
     * @returns {int}
     */
    x()
    {
        return this._x;
    }

    /**
     * @returns {int}
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

    /**
     * @returns {int}
     */
    moveSpeedModifier()
    {
        return this._moveSpeedModifier;
    }
}