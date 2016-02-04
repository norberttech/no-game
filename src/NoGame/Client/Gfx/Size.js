'use strict';

import Assert from './../../../JSAssert/Assert';

export default class Size
{
    /**
     * @param {int} width
     * @param {int} height
     */
    constructor(width, height)
    {
        Assert.greaterThan(0, width);
        Assert.greaterThan(0, height);

        this._width = width;
        this._height = height;
    }

    /**
     * @returns {int}
     */
    getWidth()
    {
        return this._width;
    }

    /**
     * @returns {int}
     */
    getHeight()
    {
        return this._height;
    }
}