'use strict';

import Tile from './Tile';
import Assert from './../../../JSAssert/Assert';

export default class Area
{
    constructor(name, x, y)
    {
        this._name = x;
        this._x = x;
        this._y = y;
        this._tiles = new Map();
    }

    /**
     * @param tile
     */
    addTile(tile)
    {
        Assert.instanceOf(tile, Tile);

        this._tiles.set(tile.toString(), tile);
    }

    /**
     * @returns {Tile[]}
     */
    tiles()
    {
        return this._tiles;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @returns {boolean}
     */
    canWalkOn(x, y)
    {
        let tile = this._tiles.get(`${x}:${y}`);

        if (tile === undefined) {
            return false;
        }

        return tile.canWalkOn();
    }
}