'use strict';

const Assert = require('assert-js');
const Animation = require('./Animation');

class Stack
{
    /**
     * @param {Animation[]} [animations]
     */
    constructor(animations = [])
    {
        Assert.containsOnly(animations, Animation);

        this._stack = animations;
    }

    /**
     * @param {Animation} animation
     */
    putOn(animation)
    {
        Assert.instanceOf(animation, Animation);

        this._stack.push(animation);
    }

    /**
     * @returns {Animation[]}
     */
    get all()
    {
        let animations = [];
        for (let animation of this._stack) {
            if (!animation.isFinished) {
                animations.push(animation);
            }
        }

        this._stack = animations;

        return this._stack;
    }

    /**
     * @returns {int}
     */
    get size()
    {
        return this.all.length;
    }
}

module.exports = Stack;