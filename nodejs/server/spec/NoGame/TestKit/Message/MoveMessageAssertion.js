'use strict';

const Assert = require('assert-js');

class MoveMessageAssertion
{
    /**
     * @param {object} message
     */
    constructor(message)
    {
        Assert.object(message);

        this._message = message;
    }

    /**
     * @param {int} x
     */
    assertX(x)
    {
        Assert.integer(x);

        if (x !== this._message.data.x) {
            throw new Error(`Expecting x to be ${x} but got ${this._message.data.x}`);
        }

        return this;
    }

    /**
     * @param {int} y
     */
    assertY(y)
    {
        Assert.integer(y);

        if (y !== this._message.data.y) {
            throw new Error(`Expecting y to be ${y} but got ${this._message.data.y}`);
        }

        return this;
    }

    /**
     * @param {int} expectedTime
     */
    assertMoveTime(expectedTime)
    {
        Assert.integer(expectedTime);

        /**
         * We need to add few milliseconds to make sure that tests are not failing
         * randomly, for example moveTime usually will be equal to 500, but sometimes it might be 499
         * (it depends when server receive message and how long it will travel)
         */
        if (Math.abs(this._message.data.moveTime - expectedTime) > 5) {
            throw new Error(`Expecting move time to be ${expectedTime} but got ${this._message.data.moveTime}`);
        }

        return this;
    }
}

module.exports = MoveMessageAssertion;