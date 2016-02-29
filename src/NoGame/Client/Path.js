'use strict';

import Assert from './../../JSAssert/Assert';
import PF from 'pathfinding';
import Position from './Position';

export default class Path
{
    constructor(path, playerPosition, centerPosition)
    {
        Assert.array(path);
        Assert.instanceOf(playerPosition, Position);
        Assert.instanceOf(centerPosition, Position);

        this._positions = [];

        for (let relativePosition of path) {
            let position = new Position(
                relativePosition.x - centerPosition.getX() + playerPosition.getX(),
                relativePosition.y - centerPosition.getY() + playerPosition.getY()
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
    getPositions()
    {
        return this._positions;
    }

    /**
     * @returns {Position}
     */
    getNextPosition()
    {
        return this._positions.shift();
    }

    /**
     * @returns {boolean}
     */
    hasNextPosition()
    {
        return this._positions.length > 0;
    }
}