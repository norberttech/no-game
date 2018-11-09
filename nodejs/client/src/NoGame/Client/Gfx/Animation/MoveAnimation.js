'use strict';

const Animation = require('./Animation');

class MoveAnimation extends Animation
{
    /**
     * @returns {int}
     */
    get distance()
    {
        throw `Method not implemented.`;
    }
}

module.exports = MoveAnimation;