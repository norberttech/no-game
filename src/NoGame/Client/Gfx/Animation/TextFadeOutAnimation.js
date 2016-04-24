'use strict';

import Assert from 'assert-js';
import MoveAnimation from './MoveAnimation';
import Font from './../Font';

export default class TextFadeOutAnimation extends MoveAnimation
{
    /**
     * @param {string} text
     * @param {Font} font
     * @param {int} animationSpeed
     * @param {int} distance
     * @param {int} step
     */
    constructor(text, font, animationSpeed, distance, step)
    {
        Assert.string(text);
        Assert.instanceOf(font, Font);
        Assert.integer(animationSpeed);
        Assert.integer(distance);
        Assert.integer(step);

        super();

        this._text = text;
        this._font = font;
        this._animationSpeed = animationSpeed;
        this._distance = distance;
        this._step = step;
        this._currentDistance = 0;
        this._lastDistanceChange = new Date().getTime();
    }

    /**
     * @returns {string}
     */
    get text()
    {
        return this._text;
    }

    /**
     * @returns {Font}k
     */
    get font()
    {
        return this._font;
    }

    /**
     * @returns {string}
     */
    get distance()
    {
        if (this._currentDistance >= this._distance) {
            return this._distance;
        }

        if (new Date().getTime() >= this._lastDistanceChange + this._animationSpeed) {
            this._currentDistance += this._step;
            this._lastDistanceChange = new Date().getTime();
        }

        return this._currentDistance;
    }

    /**
     * @returns {boolean}
     */
    get isFinished()
    {
        return this._currentDistance >= this._distance;
    }
}