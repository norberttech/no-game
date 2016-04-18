'use strict';

import Assert from 'assert-js';
import Animation from './Animation';

export default class LinearAnimation extends Animation
{
    /**
     * @param {[]} frames
     * @param {int} animationSpeed
     * @param {boolean} [infinite]
     */
    constructor(frames, animationSpeed, infinite = false)
    {
        Assert.array(frames);
        Assert.integer(animationSpeed);
        Assert.boolean(infinite);
        super();

        this._infinite = infinite;
        this._frames = frames;
        this._animationSpeed = animationSpeed;
        this._currentFrame = 0;
        this._lastFrameChange = new Date().getTime();
    }

    /**
     * @returns {string}
     */
    get frame()
    {
        if (new Date().getTime() >= this._lastFrameChange + this._animationSpeed) {
            this._currentFrame += 1;
            this._lastFrameChange = new Date().getTime();
        }

        if (this._currentFrame >= this._frames.length) {
            this._currentFrame = 0;
        }

        return this._frames[this._currentFrame];
    }

    /**
     * @returns {boolean}
     */
    get isFinished()
    {
        if (this._infinite) {
            return false;
        }

        return this._currentFrame === this._frames.length - 1;
    }
}