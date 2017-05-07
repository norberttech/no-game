'use strict';

const Assert = require('assert-js');

class AreaRange
{
    /**
     * @param {int} startX
     * @param {int} endX
     * @param {int} startY
     * @param {int} endY
     */
    constructor(startX, endX, startY, endY)
    {
        Assert.integer(startX);
        Assert.integer(endX);
        Assert.integer(startY);
        Assert.integer(endY);

        this._startX = startX;
        this._endX = endX;
        this._startY = startY;
        this._endY = endY;
    }

    /**
     * @returns {int}
     */
    get startX()
    {
        return this._startX;
    }

    /**
     * @returns {int}
     */
    get endX()
    {
        return this._endX;
    }

    /**
     * @returns {int}
     */
    get startY()
    {
        return this._startY;
    }

    /**
     * @returns {int}
     */
    get endY()
    {
        return this._endY;
    }
}

module.exports = AreaRange;
