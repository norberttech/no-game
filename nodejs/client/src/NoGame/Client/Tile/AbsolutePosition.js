'use strict';

const Assert = require('assert-js');
const Directions = require('./../Directions');

class AbsolutePosition
{
    /**
     * @param {int} x
     * @param {int} y
     */
    constructor(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

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

    /**
     * @returns {string}
     */
    toString()
    {
        return `${this._x}:${this._y}`;
    }

    /**
     * @param {int} direction
     * @returns {AbsolutePosition}
     */
    next(direction)
    {
        Assert.integer(direction);

        switch (direction) {
            case Directions.RIGHT:
                return new AbsolutePosition(this._x + 1, this._y);
            case Directions.LEFT:
                return new AbsolutePosition(this._x - 1, this._y);
            case Directions.DOWN:
                return new AbsolutePosition(this._x, this._y + 1);
            case Directions.UP:
                return new AbsolutePosition(this._x, this._y - 1);
            default:
                throw `Unknown direction`;
        }
    }

    /**
     * @param {AbsolutePosition} point
     * @returns {number}
     */
    direction(point)
    {
        Assert.instanceOf(point, AbsolutePosition);

        let xDiff = this._x - point.x;
        let yDiff = this._y - point.y;

        if (xDiff >= 1) {
            return Directions.LEFT;
        }

        if (xDiff <= -1) {
            return Directions.RIGHT;
        }

        if (yDiff >= 1) {
            return Directions.UP;
        }

        return Directions.DOWN;
    }

    /**
     * @param {AbsolutePosition} position
     * @return {boolean}
     */
    isEqual(position)
    {
        Assert.instanceOf(position, AbsolutePosition);

        return position.x === this._x && position.y === this._y;
    }
}

module.exports = AbsolutePosition;