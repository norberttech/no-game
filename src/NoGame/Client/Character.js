'use strict';

import Position from './Position';
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
        this._position = new Position(x, y);
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
     * @returns {Position}
     */
    position()
    {
        return this._position;
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    move(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._position = new Position(x, y);
    }
}