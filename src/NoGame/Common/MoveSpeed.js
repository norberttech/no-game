'use strict';

const Assert = require('assert-js');

/**
 * @type {number}
 */
const BASE_MOVE_TIME = 500;

class MoveSpeed
{
    /**
     * @param {number} distance
     * @param {int} [moveSpeedModifier]
     * @returns {number}
     */
    static calculateMoveTime(distance, moveSpeedModifier = 0)
    {
        Assert.number(distance);
        Assert.integer(moveSpeedModifier);

        return ((distance * BASE_MOVE_TIME * 100) - moveSpeedModifier) / 100;
    }
}

module.exports = MoveSpeed;