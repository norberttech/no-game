'use strict';

import Assert from './../../../../JSAssert/Assert';
import Item from './Item';
import Position from './Position';

export default class Tile
{
    /**
     * @param {Position} position
     * @param {Item} ground
     * @param {Item[]} stack
     * @param {integer} moveSpeedModifier
     */
    constructor(position, ground, stack = [], moveSpeedModifier = 0)
    {
        Assert.instanceOf(position, Position);
        Assert.instanceOf(ground, Item);
        Assert.array(stack);
        if (stack.length) {
            Assert.containsOnly(stack, Item);
        }
        Assert.integer(moveSpeedModifier);

        this._position = position;
        this._ground = ground;
        this._stack = stack;
        this._moveSpeedModifier = 0;
    }

    /**
     * @returns {boolean}
     */
    canWalkOn()
    {
        if (this._ground.isBlocking()) {
            return false;
        }

        for (let item of this._stack) {
            if (item.isBlocking()) {
                return false;
            }
        }

        return true;
    }

    /**
     * @returns {Position}
     */
    position()
    {
        return this._position;
    }

    /**
     * @returns {number}
     */
    moveSpeedModifier()
    {
        return this._moveSpeedModifier;
    }
}
