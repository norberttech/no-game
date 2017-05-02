'use strict';

/**
 * Since setTimeout is not the best solution and setImmediate can cosnume a lot of
 * processor this GameLoop use both functions.
 *
 * More here: http://timetocode.tumblr.com/post/71512510386/an-accurate-nodejs-game-loop-inbetween-settimeout
 */
class GameLoop
{
    /**
     * @param {int} tickLengthTime
     * @param {function} callback
     */
    constructor(tickLengthTime, callback)
    {
        this._tickLengthTime = tickLengthTime;
        this._previousTick = new Date().getTime();
        this._actualTicks = 0;
        this._callback = callback;
    }

    /**
     * Starts game loop and continue to execute it.
     */
    start()
    {
        let now = new Date().getTime();
        this._actualTicks++;

        if (this._previousTick + this._tickLengthTime <= now) {
            let delta = (now - this._previousTick) / 1000;
            this._previousTick = now;

            this._callback(delta);

            this._actualTicks = 0
        }

        if (new Date().getTime() - this._previousTick < this._tickLengthTime - 16) {
            setTimeout(this.start.bind(this));
        } else {
            setImmediate(this.start.bind(this));
        }
    }
}

module.exports = GameLoop;