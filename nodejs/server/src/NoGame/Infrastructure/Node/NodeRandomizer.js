'use strict';

const Assert = require('assert-js');
const Randomizer = require('./../../Engine/Randomizer');

class NodeRandomizer extends Randomizer
{
    /**
     * @returns {number}
     */
    random()
    {
        return Math.random();
    }
}

module.exports = NodeRandomizer;