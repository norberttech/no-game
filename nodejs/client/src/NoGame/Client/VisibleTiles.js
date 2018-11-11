'use strict';

const Assert = require('assert-js');
const RelativePosition = require('./Tile/RelativePosition');

class VisibleTiles
{
    /**
     * @param {int} sizeX
     * @param {int} sizeY
     * @param {int} marginSize
     */
    constructor(sizeX, sizeY, marginSize)
    {
        Assert.greaterThan(0, sizeX);
        Assert.greaterThan(0, sizeY);
        Assert.greaterThan(0, marginSize);

        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._marginSize = marginSize;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {RelativePosition}
     */
    newPosition(x, y)
    {
        return new RelativePosition(x, y, this);
    }

    /**
     * @returns {int}
     */
    get sizeX()
    {
        return this._sizeX;
    }

    /**
     * @returns {int}
     */
    get sizeY()
    {
        return this._sizeY;
    }

    /**
     * Margin size tells client how many tiles from each
     * side should be hidden in order to render move animation
     * smoothly.
     *
     * @returns {int}
     */
    get marginSize()
    {
        return this._marginSize;
    }

    /**
     * @return {RelativePosition}
     */
    get centerPosition()
    {
        return RelativePosition.createCenter(this);
    }

    /**
     * @param {function} callback
     */
    each(callback)
    {
        for (let relativeTileY = 0; relativeTileY < this._sizeY; relativeTileY++) {
            for (let relativeTileX = 0; relativeTileX < this._sizeX; relativeTileX++) {
                callback(new RelativePosition(relativeTileX, relativeTileY, this));
            }
        }
    }
}

module.exports = VisibleTiles;