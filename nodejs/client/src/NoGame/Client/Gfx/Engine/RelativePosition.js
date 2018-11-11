'use strict';

const Assert = require('assert-js');
const VisibleTiles = require('./../Engine/VisibleTiles');
const AreaCalculator = require('./../../../Common/AreaCalculator');

class RelativePosition
{
    /**
     * @param {int} x
     * @param {int} y
     * @param {VisibleTiles} visibleTiles
     */
    constructor(x, y, visibleTiles)
    {
        Assert.greaterThanOrEqual(0, x);
        Assert.greaterThanOrEqual(0, y);
        Assert.lessThanOrEqual(visibleTiles.sizeX - visibleTiles.marginSize, x);
        Assert.lessThanOrEqual(visibleTiles.sizeY - visibleTiles.marginSize, y);

        this._x = x;
        this._y = y;
        this._visibleTiles = visibleTiles;
    }

    /**
     * @param {VisibleTiles} visibleTiles
     * @returns {RelativePosition}
     */
    static createCenter(visibleTiles)
    {
        let centerPosition = AreaCalculator.centerPosition(visibleTiles.sizeX, visibleTiles.sizeY);

        return new this(centerPosition.x, centerPosition.y, visibleTiles);
    }

    /**
     * @returns {int}
     */
    get x()
    {
        return this._x;
    }

    /**
     * @returns {int}
     */
    get y()
    {
        return this._y;
    }

    /**
     * @returns {boolean}
     */
    get isCenter()
    {
        let centerPosition = AreaCalculator.centerPosition(this._visibleTiles.sizeX, this._visibleTiles.sizeY);

        return centerPosition.x === this._x && centerPosition.y === this._y;
    }
}

module.exports = RelativePosition;