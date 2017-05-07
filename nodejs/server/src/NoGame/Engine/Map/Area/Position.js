'use strict';

const Assert = require('assert-js');
const Utils = require('nogame-common').Utils;

class Position
{
    /**
     * @param {int} x
     * @param {int} y
     */
    constructor(x, y)
    {
        Assert.greaterThan(-1, x);
        Assert.greaterThan(-1, y);

        this._x = x;
        this._y = y;
    }

    /**
     * @param {Position} position
     * @returns {Position}
     */
    static randomNextTo(position)
    {
        Assert.instanceOf(position, Position);
        switch (Utils.randomRange(1, 4)) {
            case 1: // left
                return new Position(position.x - 1, position.y);
            case 2: // down
                return new Position(position.x, position.y + 1);
            case 3: // right
                return new Position(position.x + 1, position.y);
            case 4: // up
                return new Position(position.x, position.y - 1);
        }

        throw `Can't generate random position next to ${position.toString()}`;
    }

    /**
     * @returns {string}
     */
    toString()
    {
        return `${this._x}:${this._y}`;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {string}
     */
    static toStringFromNative(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        return `${x}:${y}`;
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
     * @param {Position} otherPosition
     * @returns {boolean}
     */
    isEqualTo(otherPosition)
    {
        Assert.instanceOf(otherPosition, Position);

        return otherPosition.x === this._x && otherPosition.y === this._y;
    }

    /**
     *
     * @param {Position} otherPosition
     * @returns {number}
     */
    calculateDistanceTo(otherPosition)
    {
        let x1 = this._x;
        let x2 = otherPosition.x;
        let y1 = this._y;
        let y2 = otherPosition.y;
        let distance = Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);

        return Math.round(distance * 10) / 10;
    }
}

module.exports = Position;