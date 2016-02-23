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
        Assert.integer(width);
        Assert.integer(height);

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