'use strict';

import Assert from 'assert-js';

export default class Tile
{
    /**
     * @param {int} x
     * @param {int} y
     * @param {boolean} canWalkOn
     * @param {int} ground
     * @param {array} stack
     * @param {int} moveSpeedModifier
     */
    constructor(x, y, canWalkOn, ground, stack, moveSpeedModifier)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.boolean(canWalkOn);
        Assert.integer(ground);
        Assert.array(stack);
        Assert.integer(moveSpeedModifier);

        this._x = x;
        this._y = y;
        this._canWalkOn = canWalkOn;
        this._ground = ground;
        this._stack = stack;
        this._moveSpeedModifier = moveSpeedModifier;
    }

    /**
     * @returns {int}
     */
    get x()
    {
        return this._x;
    }

    /**
     * @returns {int}
     */
    get y()
    {
        return this._y;
    }

    /**
     * @returns {int}
     */
    get ground()
    {
        return this._ground;
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
    get canWalkOn()
    {
        return this._canWalkOn;
    }

    /**
     * @returns {array}
     */
    get stack()
    {
        return this._stack;
    }

    /**
     * @returns {int}
     */
    get moveSpeedModifier()
    {
        return this._moveSpeedModifier;
    }
}