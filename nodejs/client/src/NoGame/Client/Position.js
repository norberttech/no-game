'use strict';

const Assert = require('assert-js');
const Directions = require('./Directions');

class Position
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
     * @returns {Position}
     */
    next(direction)
    {
        Assert.integer(direction);

        switch (direction) {
            case Directions.RIGHT:
                return new Position(this._x + 1, this._y);
            case Directions.LEFT:
                return new Position(this._x - 1, this._y);
            case Directions.DOWN:
                return new Position(this._x, this._y + 1);
            case Directions.UP:
                return new Position(this._x, this._y - 1);
            default:
                throw `Unknown direction`;
        }
    }

    /**
     * @param {Position} point
     * @returns {number}
     */
    direction(point)
    {
        Assert.instanceOf(point, Position);

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
     * @param {Position} position
     * @return {boolean}
     */
    isEqual(position)
    {
        Assert.instanceOf(position, Position);

        return position.x === this._x && position.y === this._y;
    }
}

module.exports = Position;