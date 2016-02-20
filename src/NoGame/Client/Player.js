'use strict';

import Assert from './../../JSAssert/Assert';

export default class Player
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
        this._positon = {x: x, y: y};
        this._movingTo = {x: x, y: y};
        this._moveStart = new Date().getTime();
    }

    /**
     * Lock player when waiting for server response.
     */
    movingTo(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._movingTo = {x: x, y: y};
        this._moveStart = new Date().getTime();
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    isMovingTo(x, y)
    {
        return this._movingTo.x === x && this._movingTo.y === y;
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
        if (new Date().getTime() > this._moveStart + 3000 ) {
            this._movingTo = this._positon;
        }

        return this._positon.x !== this._movingTo.x || this._positon.y !== this._movingTo.y;
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    move(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._positon = {x: x, y: y};
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
        return this._positon;
    }
}