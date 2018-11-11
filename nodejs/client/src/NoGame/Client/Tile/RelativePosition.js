'use strict';

const Assert = require('assert-js');
const Player = require('./../Player');
const AbsolutePosition = require('./AbsolutePosition');
const VisibleTiles = require('./../VisibleTiles');
const AreaCalculator = require('./../../Common/AreaCalculator');

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
     * @param {Player} player
     * @returns {AbsolutePosition}
     */
    toAbsolute(player)
    {
        Assert.instanceOf(player, Player);

        return new AbsolutePosition(
            player.position.x + this._x - this.center.x,
            player.position.y + this._y - this.center.y,
        )
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {RelativePosition}
     */
    jumpBy(x, y)
    {
        return new RelativePosition(this._x + x, this.y + y, this._visibleTiles);
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

    /**
     * @returns {RelativePosition}
     */
    get center()
    {
        return RelativePosition.createCenter(this._visibleTiles);
    }

    /**
     * @param {RelativePosition} position
     * @returns {boolean}
     */
    isEqual(position)
    {
        return this._x === position.x && this._y === position.y;
    }

    /**
     * @returns {string}
     */
    toString()
    {
        return `${this._x}:${this._y}`;
    }
}

module.exports = RelativePosition;