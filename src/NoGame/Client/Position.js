'use strict';

import Assert from 'assert-js';
import Directions from './Directions';

export default class Position
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
    getX()
    {
        return this._x;
    }

    /**
     * @returns {int}
     */
    getY()
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
     * @param {Position} position
     * @return {boolean}
     */
    isEqual(position)
    {
        Assert.instanceOf(position, Position);

        return position.getX() === this._x && position.getY() === this._y;
    }
}