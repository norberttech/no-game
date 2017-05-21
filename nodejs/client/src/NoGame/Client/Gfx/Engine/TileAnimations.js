'use strict';

import Assert from 'assert-js';
import Animation from './../Animation/Animation';
import Stack from './../Animation/Stack';

export default class TileAnimations
{
    constructor()
    {
        this._tileAnimations = new Map();
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {Animation} animation
     */
    add(x, y, animation)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.instanceOf(animation, Animation);

        if (!this.has(x,y)) {
            this._tileAnimations.set(`${x}:${y}`, new Stack([animation]));
        } else {
            this._tileAnimations.get(`${x}:${y}`).putOn(animation);
        }
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {Stack}
     */
    get(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        if (!this.has(x, y)) {
            throw `There is no animation defined for ${x}:${y}`;
        }

        return this._tileAnimations.get(`${x}:${y}`);
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    has(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        if (this._tileAnimations.has(`${x}:${y}`)) {
            if (!this._tileAnimations.get(`${x}:${y}`).size) {
                return false;
            }

            return true;
        }

        return false;
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    remove(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        if (!this.has(x, y)) {
            throw `There is no animation defined for ${x}:${y}`;
        }

        this._tileAnimations.delete(`${x}:${y}`);
    }

    clear()
    {
        this._tileAnimations = new Map();
    }
}