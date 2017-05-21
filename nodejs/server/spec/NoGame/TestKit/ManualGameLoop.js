'use strict';

const Assert = require('assert-js');
const GameLoop = require('./../../../src/NoGame/Server/GameLoop');

class ManualGameLoop extends GameLoop
{
    _tick()
    {
        if (this._isTerminated === true) {
            return ;
        }

        let now = new Date().getTime();
        this._actualTicks++;

        if (this._previousTick + this._tickLengthTime <= now) {
            let delta = (now - this._previousTick) / 1000;
            this._previousTick = now;

            this._callback(delta);

            this._actualTicks = 0
        }
    }

    tick()
    {
        this._tick();
    }
}

module.exports = ManualGameLoop;