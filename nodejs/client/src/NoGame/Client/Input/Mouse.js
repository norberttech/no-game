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
     * @param {int} x
     * @param {int} y
     */
    setPosition(x, y)
    {
        this._x = x;
        this._y = y;
    }

    /**
     * @returns {int}
     */
    get x()
    {
        return Math.floor(this._x);
    }

    /**
     * @returns {int}
     */
    get y()
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