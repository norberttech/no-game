'use strict';

const Assert = require('assert-js');

class Clock
{
    /**
     * @returns {int}
     */
    time()
    {
        return new Date().getTime();
    }
}

module.exports = Clock;