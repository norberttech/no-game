'use strict';

const Assert = require('assert-js');
const AreaRange = require('./AreaRange');

class AreaCalculator
{
    /**
     * @param {int} centerX
     * @param {int} centerY
     * @param {int} tilesX
     * @param {int} tilesY
     * @returns {AreaRange}
     */
    static visibleTilesRange(centerX, centerY, tilesX, tilesY)
    {
        Assert.integer(centerX);
        Assert.integer(centerY);
        Assert.oddNumber(tilesX);
        Assert.oddNumber(tilesY);

        return new AreaRange(
            centerX - ((tilesX - 1) / 2),
            centerX - Math.round(tilesX / 2) + tilesX,
            centerY - ((tilesY - 1) / 2),
            centerY - Math.round(tilesY / 2) + tilesY
        );
    }

    /**
     * Remember that tiles starts from zero. 15 - 1 = 14; 14 / 2 = 7.
     * So center tile will be eight tile from zero tile.
     *
     * @param {int} tilesX
     * @param {int} tilesY
     * @returns {{x: int, y: int}}
     */
    static centerPosition(tilesX, tilesY)
    {
        Assert.oddNumber(tilesX);
        Assert.oddNumber(tilesY);

        return {
            x: (tilesX - 1) / 2,
            y: (tilesY - 1) / 2
        }
    }
}

module.exports = AreaCalculator;