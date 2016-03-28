'use strict';

import Assert from 'assert-js';

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
     * @returns {boolean}
     */
    get isPositive()
    {
        return this._width > 0 || this._height > 0;
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

    /**
     * @param {Size} size
     * @returns {Size}
     */
    add(size)
    {
        Assert.instanceOf(size, Size);

        return new Size(this._width + size.getWidth(), this._height + size.getHeight());
    }

    /**
     * @param {Size} size
     * @returns {Size}
     */
    subtract(size)
    {
        Assert.instanceOf(size, Size);

        return new Size(this._width - size.getWidth(), this._height - size.getHeight());
    }
}