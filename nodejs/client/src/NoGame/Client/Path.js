'use strict';

import Assert from 'assert-js';
import PF from 'pathfinding';
import Position from './Position';

export default class Path
{
    /**
     * @param {Array} path
     * @param {Position} playerPosition
     * @param {Position} centerPosition
     */
    constructor(path, playerPosition, centerPosition)
    {
        Assert.array(path);
        Assert.instanceOf(playerPosition, Position);
        Assert.instanceOf(centerPosition, Position);

        this._positions = [];

        for (let relativePosition of path) {
            let position = new Position(
                relativePosition.x - centerPosition.x + playerPosition.x,
                relativePosition.y - centerPosition.y + playerPosition.y
            );

            // skip player current position
            if (position.isEqual(playerPosition)) {
                continue;
            }

            this._positions.push(position);
        }
    }

    /**
     * @returns {Array}
     */
    get positions()
    {
        return this._positions;
    }

    /**
     * @returns {Position}
     */
    get nextPosition()
    {
        return this._positions.shift();
    }

    /**
     * @returns {boolean}
     */
    get hasNextPosition()
    {
        return this._positions.length > 0;
    }
}