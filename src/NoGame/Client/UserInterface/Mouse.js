'use strict';

export default class Mouse
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

    getX()
    {
        return this._x;
    }

    getY()
    {
        return this._y;
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