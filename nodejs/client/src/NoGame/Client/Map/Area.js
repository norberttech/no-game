'use strict';

const Tile = require('./Tile');
const AbsolutePosition = require('./../Tile/AbsolutePosition');
const Assert = require('assert-js');

class Area
{
    constructor(name)
    {
        this._name = name;
        this._tiles = new Map();
    }

    /**
     * @param {Tile} tile
     */
    setTile(tile)
    {
        Assert.instanceOf(tile, Tile);

        this._tiles.set(tile.position.toString(), tile);
    }

    /**
     * @param {Tile[]} tiles
     */
    setTiles(tiles)
    {
        Assert.containsOnly(tiles, Tile);

        this._tiles.clear();

        for (let tile of tiles) {
            this._tiles.set(tile.position.toString(), tile);
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
     * @param {AbsolutePosition} position
     *
     * @returns {boolean}
     */
    canWalkOn(position)
    {
        let tile = this._tiles.get(position.toString());

        if (tile === undefined) {
            return false;
        }

        return tile.canWalkOn;
    }

    /**
     * @param {AbsolutePosition} position
     * @returns {Tile}
     */
    tile(position)
    {
        Assert.instanceOf(position, AbsolutePosition);

        return this._tiles.get(position.toString());
    }
}

module.exports = Area;