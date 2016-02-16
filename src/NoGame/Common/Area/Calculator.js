'use strict';

import Assert from './../../../JSAssert/Assert';

export default class Calculator
{
    /**
     * @param {int} centerX
     * @param {int} centerY
     * @param {int} tilesX
     * @param {int} tilesY
     * @returns {{x: {start: int, end: int}, y: {start: int, end: int}}}
     */
    static visibleTilesRange(centerX, centerY, tilesX, tilesY)
    {
        Assert.integer(centerX);
        Assert.integer(centerY);
        Assert.oddNumber(tilesX);
        Assert.oddNumber(tilesY);

        return {
            x: {
                start: centerX - ((tilesX - 1) / 2),
                end: centerX - ((tilesX - 1) / 2) + tilesX
            },
            y: {
                start: centerY - ((tilesY - 1) / 2),
                end: centerY - ((tilesY - 1) / 2) + tilesY
            }
        };
    }

    /**
     * @param {int} tilesX
     * @param {int} tilesY
     * @returns {{x: int, y: int}}
     */
    static centerPosition(tilesX, tilesY)
    {
        return {
            x: (tilesX - 1) / 2,
            y: (tilesY - 1) / 2
        }
    }
}