'use strict';

import Assert from 'assert-js';
import Animation from './../Animation/Animation';

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

        this._tileAnimations.set(`${x}:${y}`, animation);
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {Animation}
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
            let animation = this._tileAnimations.get(`${x}:${y}`);

            if (animation.isFinished) {
                this._tileAnimations.delete(`${x}:${y}`);
            }
        }

        return this._tileAnimations.has(`${x}:${y}`);
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
}