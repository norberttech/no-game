'use strict';

class Mouse
{
    constructor()
    {
        this._x = 0;
        this._y = 0;
        this._onClick = null;
    }

    /**
     * @param {int} pixelPositionX
     * @param {int} pixelPositionY
     */
    setPixelPosition(pixelPositionX, pixelPositionY)
    {
        this._x = pixelPositionX;
        this._y = pixelPositionY;
    }

    /**
     * @returns {int}
     */
    get pixelPositionX()
    {
        return Math.floor(this._x);
    }

    /**
     * @returns {int}
     */
    get pixelPositionY()
    {
        return Math.floor(this._y);
    }

    /**
     * @param {function} callback
     */
    onClick(callback)
    {
        this._onClick = callback;
    }

    click()
    {
        if (this._onClick === null) {
            return ;
        }

        this._onClick();
    }
}

module.exports = Mouse;