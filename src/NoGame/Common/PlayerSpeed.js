'use strict';

import Assert from 'assert-js';

/**
 * @type {number}
 */
const BASE_MOVE_SPEED_MODIFIER = 100;

/**
 * @type {number}
 */
const BASE_MOVE_TIME = 500;

export default class PlayerSpeed
{
    /**
     * @param {number} distance
     * @param {int} moveSpeedModifier
     * @returns {number}
     */
    static calculateMoveTime(distance, moveSpeedModifier)
    {
        let modifier = BASE_MOVE_SPEED_MODIFIER + moveSpeedModifier;

        return ((distance * BASE_MOVE_TIME * 100) - modifier) / 100;
    }
}