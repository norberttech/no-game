'use strict';

import Assert from './../../JSAssert/Assert';

export default class Character
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} x
     * @param {int} y
     */
    constructor(id, name, x, y)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.string(id);
        Assert.string(name);

        this._id = id;
        this._name = name;
        this._x = x;
        this._y = y;
    }

    /**
     * @returns {string}
     */
    id()
    {
        return this._id;
    }

    /**
     * @returns {string}
     */
    name()
    {
        return this._name;
    }

    /**
     * @returns {{x: *, y: *}}
     */
    position()
    {
        return {x: this._x, y: this._y};
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    move(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._x = x;
        this._y = y;
    }
}