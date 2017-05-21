'use strict';

const Assert = require('assert-js');
const Randomizer = require('./../../../src/NoGame/Engine/Randomizer');

class ManualRandomizer extends Randomizer
{
    /**
     * @param {number} defaultValue
     */
    constructor(defaultValue)
    {
        Assert.number(defaultValue);

        super();

        this._default = defaultValue;
    }

    /**
     * @param {number} defaultValue
     */
    changeDefault(defaultValue)
    {
        Assert.number(defaultValue);

        this._default = defaultValue;
    }

    /**
     * @returns {number}
     */
    random()
    {
        return this._default;
    }
}

module.exports = ManualRandomizer;