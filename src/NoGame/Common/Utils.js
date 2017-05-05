'use strict';

class Utils
{
    /**
     * @param {int} minimum
     * @param {int} maximum
     * @returns {int}
     */
    static randomRange(minimum, maximum)
    {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    }

    /**
     * @param {int} number
     * @returns {number}
     */
    static randomSign(number)
    {
        let sign = Utils.randomRange(0, 1);

        return sign === 0 ? number : -number;
    }

    /**
     * @param {int} milliseconds
     */
    static sleep(milliseconds)
    {
        let e = new Date().getTime() + milliseconds;

        while (new Date().getTime() <= e) {}
    }
}

module.exports = Utils;