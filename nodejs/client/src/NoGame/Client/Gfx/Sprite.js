'use strict';

const Assert = require('assert-js');

class Sprite
{
    /**
     * @param {Image} img
     * @param {integer} offsetX
     * @param {integer} offsetY
     * @param {integer} width
     * @param {integer} height
     */
    constructor(img, offsetX, offsetY, width, height)
    {
        Assert.instanceOf(img, Image);
        Assert.integer(offsetX);
        Assert.integer(offsetY);
        Assert.integer(width);
        Assert.integer(height);

        this._img = img;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._width = width;
        this._height = height;
    }

    /**
     * @returns {Image}
     */
    img()
    {
        return this._img;
    }

    /**
     * @returns {integer}
     */
    offsetX()
    {
        return this._offsetX;
    }

    /**
     * @returns {integer}
     */
    offsetY()
    {
        return this._offsetY;
    }

    /**
     * @returns {integer}
     */
    width()
    {
        return this._width;
    }

    /**
     * @returns {integer}
     */
    height()
    {
        return this._height;
    }
}

module.exports = Sprites;