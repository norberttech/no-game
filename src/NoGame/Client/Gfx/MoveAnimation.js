'use strict';

import Directions from './../Directions';

export default class MoveAnimation
{
    /**
     * @param {int} duration
     * @param {number} distancePx
     * @param {function} finishCallback
     * @param {int} direction
     */
    constructor(duration, distancePx, finishCallback, direction)
    {
        this._finishCallback = finishCallback;
        this._endTime = new Date().getTime() + duration;
        this._duration = duration;
        this._distancePx = distancePx;
        this._direction = direction;
    }

    /**
     * @returns {boolean}
     */
    isFinished()
    {
        return new Date().getTime() > this._endTime;
    }

    executeCallback()
    {
        this._finishCallback();
    }

    /**
     * @returns {{x: number, y: number}}
     */
    calculatePixelOffset()
    {
        let offsetX = 0;
        let offsetY = 0;

        if (this._direction === Directions.RIGHT) {
            offsetX -= this._getProgress();
        }

        if (this._direction === Directions.LEFT) {
            offsetX += this._getProgress();
        }

        if (this._direction === Directions.UP) {
            offsetY -= this._getProgress();
        }

        if (this._direction === Directions.DOWN) {
            offsetY += this._getProgress();
        }

        return {x: Math.round(offsetX), y: Math.round(offsetY)};
    }


    /**
     * @returns {int}
     * @private
     */
    _getProgress()
    {
        let progress = Math.min((this._duration - (this._endTime - new Date().getTime())) / this._duration, 1);

        return (this._distancePx * progress);
    }
}