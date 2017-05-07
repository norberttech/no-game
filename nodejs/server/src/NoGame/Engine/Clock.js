'use strict';

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