'use strict';

const Assert = require('assert-js');
const Colors = require('./Colors');

class Font
{
    /**
     * @param {string} fontName
     * @param {string} fontWeight
     * @param {int} fontSize
     * @param {string} [color]
     * @param {string} [colorOutline]
     */
    constructor(fontName, fontWeight, fontSize, color = Colors.WHITE, colorOutline = Colors.BLACK)
    {
        Assert.string(fontName);
        Assert.string(fontWeight);
        Assert.integer(fontSize);
        Assert.string(color);
        Assert.string(colorOutline);

        this._name = fontName;
        this._fontWeight = fontWeight;
        this._fontSize = fontSize;
        this._color = color;
        this._colorOutline = colorOutline;
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * @returns {string}
     */
    get weight()
    {
        return this._fontWeight;
    }

    /**
     * @returns {int}
     */
    get size()
    {
        return this._fontSize;
    }

    /**
     * @returns {string}
     */
    get color()
    {
        return this._color;
    }

    /**
     * @returns {string}
     */
    get colorOutline()
    {
        return this._colorOutline;
    }
}

module.exports = Font;
