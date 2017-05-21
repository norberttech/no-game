'use strict';

const Assert = require('assert-js');
const Clock = require('./../../../src/NoGame/Engine/Clock');

class ManualClock extends Clock
{
    /**
     * @param {int} time
     */
    constructor(time)
    {
        super();

        Assert.integer(time);

        this._time = time;
    }

    time()
    {
        return this._time;
    }

    /**
     * @param {int} milliseconds
     */
    pushForward(milliseconds)
    {
        this._time += milliseconds;
    }
}

module.exports = ManualClock;