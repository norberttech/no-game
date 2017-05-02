'use strict';

const Assert = require('assert-js');

class Grid
{
    /**
     * @param {int} sizeX
     * @param {int} sizeY
     */
    constructor(sizeX, sizeY)
    {
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._tiles = [];
    }

    /**
     * @returns {int}
     */
    getSizeX()
    {
        return this._sizeX;
    }

    /**
     * @returns {int}
     */
    getSizeY()
    {
        return this._sizeY;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {boolean} walkable
     */
    addTile(x, y, walkable)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.boolean(walkable);

        this._tiles.push({
            x: x,
            y: y,
            walkable: walkable
        });
    }

    /**
     * @returns {Array}
     */
    getTiles()
    {
        return this._tiles;
    }
}

module.exports = Grid;