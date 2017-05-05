'use strict';

/**
 * Since setTimeout is not the best solution and setImmediate can cosnume a lot of
 * processor this GameLoop use both functions.
 *
 * More here: http://timetocode.tumblr.com/post/71512510386/an-accurate-nodejs-game-loop-inbetween-settimeout
 */
class GameLoop
{
    constructor()
    {
        this._isTerminated = true;
        this._timeout = null;
        this._immediate = null;
    }

    /**
     * @param {int} tickLengthTime
     * @param {function} callback
     */
    start(tickLengthTime, callback)
    {
        this._tickLengthTime = tickLengthTime;
        this._previousTick = new Date().getTime();
        this._callback = callback;
        this._actualTicks = 0;
        this._isTerminated = false;

        setTimeout(this._tick.bind(this));
    }

    stop()
    {
        this._isTerminated = true;
        clearTimeout(this._timeout);
        clearImmediate(this._immediate);
    }

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

        if (new Date().getTime() - this._previousTick < this._tickLengthTime - 16) {
            this._timeout = setTimeout(this._tick.bind(this));
        } else {
            this._immediate = setImmediate(this._tick.bind(this));
        }
    }
}

module.exports = GameLoop;