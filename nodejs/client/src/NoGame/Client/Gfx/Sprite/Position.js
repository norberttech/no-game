'use strict';

const Assert = require('assert-js');

class Position
{
    /**
     * @param {int} x
     * @param {int} y
     */
    constructor(x, y)
    {
        Assert.greaterThan(0, x);
        Assert.greaterThan(0, y);

        this._x = x;
        this._y = y;
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
}

module.exports = Position;