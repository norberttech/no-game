'use strict';

import Assert from './../../JSAssert/Assert';

/**
 * @type {number}
 */
const BASE_MOVE_SPEED_MODIFIER = 100;

/**
 * @type {number}
 */
const BASE_MOVE_TIME = 800;

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