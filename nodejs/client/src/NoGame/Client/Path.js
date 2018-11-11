'use strict';

const Assert = require('assert-js');
const PF = require('pathfinding');
const AbsolutePosition = require('./AbsolutePosition');

class Path
{
    /**
     * @param {Array} path
     * @param {AbsolutePosition} playerPosition
     * @param {AbsolutePosition} centerPosition
     */
    constructor(path, playerPosition, centerPosition)
    {
        Assert.array(path);
        Assert.instanceOf(playerPosition, AbsolutePosition);
        Assert.instanceOf(centerPosition, AbsolutePosition);

        this._positions = [];

        for (let relativePosition of path) {
            let position = new AbsolutePosition(
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
     * @returns {AbsolutePosition}
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

module.exports = Path;