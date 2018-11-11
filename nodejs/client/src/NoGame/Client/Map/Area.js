'use strict';

const Tile = require('./Tile');
const Assert = require('assert-js');

class Area
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
     * @param {int} absoluteTileX
     * @param {int} absoluteTileY
     * @returns {boolean}
     */
    canWalkOn(absoluteTileX, absoluteTileY)
    {
        let tile = this._tiles.get(`${absoluteTileX}:${absoluteTileY}`);

        if (tile === undefined) {
            return false;
        }

        return tile.canWalkOn;
    }

    /**
     * @param {int} absoluteTileX
     * @param {int} absoluteTileY
     * @returns {Tile}
     */
    tile(absoluteTileX, absoluteTileY)
    {
        Assert.integer(absoluteTileX);
        Assert.integer(absoluteTileY);

        return this._tiles.get(`${absoluteTileX}:${absoluteTileY}`);
    }
}

module.exports = Area;