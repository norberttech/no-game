'use strict';

export default class Utils
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
     * @param {int} milliseconds
     */
    static sleep(milliseconds)
    {
        var e = new Date().getTime() + milliseconds;

        while (new Date().getTime() <= e) {
            ;
        }
    }
}