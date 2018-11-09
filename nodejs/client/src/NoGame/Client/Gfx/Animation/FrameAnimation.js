'use strict';

const Assert = require('assert-js');
const Animation = require('./Animation');

class FrameAnimation extends Animation
{
    /**
     * @returns {string}
     */
    get frame()
    {
        throw `Method not implemented.`;
    }
}

module.exports = FrameAnimation;