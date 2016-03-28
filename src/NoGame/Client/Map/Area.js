'use strict';

import Tile from './Tile';
import Positon from './../Position';
import Assert from 'assert-js';

export default class Area
{
    constructor(name)
    {
        this._name = name;
        this._tiles = new Map();
    }

    /**
     * @param tile
     */
    setTile(tile)
    {
        Assert.instanceOf(tile, Tile);

        this._tiles.set(tile.toString(), tile);
    }

    /**
     * @param {Tile[]} tiles
     */
    setTiles(tiles)
    {
        Assert.containsOnly(tiles, Tile);

        this._tiles.clear();

        for (let tile of tiles) {
            this._tiles.set(tile.toString(), tile);
        }
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

    /**
     * @param {int} x
     * @param {int} y
     * @returns {Tile}
     */
    tile(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        return this._tiles.get(`${x}:${y}`);
    }
}