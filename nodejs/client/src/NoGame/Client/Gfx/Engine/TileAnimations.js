'use strict';

const Assert = require('assert-js');
const AbsolutePosition = require('./../../Tile/AbsolutePosition');
const Animation = require('./../Animation/Animation');
const Stack = require('./../Animation/Stack');

class TileAnimations
{
    constructor()
    {
        this._tileAnimations = new Map();
    }

    /**
     * @param {AbsolutePosition} position
     * @param {Animation} animation
     */
    add(position, animation)
    {
        Assert.instanceOf(position, AbsolutePosition);
        Assert.instanceOf(animation, Animation);

        if (!this.has(position)) {
            this._tileAnimations.set(position.toString(), new Stack([animation]));
        } else {
            this._tileAnimations.get(position.toString()).putOn(animation);
        }
    }

    /**
     * @param {AbsolutePosition} position
     * @returns {Stack}
     */
    get(position)
    {
        if (!this.has(position)) {
            throw `There is no animation defined for ${position.toString()}`;
        }

        return this._tileAnimations.get(position.toString());
    }

    /**
     * @param {AbsolutePosition} position
     * @returns {boolean}
     */
    has(position)
    {
        Assert.instanceOf(position, AbsolutePosition);

        if (this._tileAnimations.has(position.toString())) {
            return this._tileAnimations.get(position.toString()).size;
        }

        return false;
    }

    /**
     * @param {AbsolutePosition} position
     */
    remove(position)
    {
        Assert.instanceOf(position, AbsolutePosition);

        if (!this.has(position)) {
            throw `There is no animation defined for ${position.toString()}`;
        }

        this._tileAnimations.delete(position.toString());
    }

    clear()
    {
        this._tileAnimations = new Map();
    }
}

module.exports = TileAnimations;