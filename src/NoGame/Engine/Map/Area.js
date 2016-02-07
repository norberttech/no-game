'use strict';

import Assert from './../../../JSAssert/Assert';
import Tile from './Area/Tile';
import Position from './Area/Position';
import Player from './../Player';

export default class Area
{
    /**
     * Default spawn position is x:0, y:0 it can be changed with changeSpawnPosition() method
     *
     * @param {string} name
     * @param {int} sizeX
     * @param {int} sizeY
     */
    constructor(name, sizeX, sizeY)
    {
        Assert.greaterThan(0, sizeX);
        Assert.greaterThan(0, sizeY);

        this._name = name;
        this._sizeX = sizeX;
        this._sizeY = sizeY;
        this._tiles = new Map();
        this._players = new Map();
        this._spawnPosition = new Position(0, 0);
    }

    /**
     * @returns {string}
     */
    name()
    {
        return this._name;
    }

    /**
     * @returns {Tile[]}
     */
    tiles()
    {
        return Array.from(this._tiles.values());
    }

    /**
     * @param {Position} newSpawnPosition
     */
    changeSpawnPosition(newSpawnPosition)
    {
        Assert.instanceOf(newSpawnPosition, Position);

        this._spawnPosition = newSpawnPosition;
    }

    /**
     * @param {Tile} newTile
     */
    addTile(newTile)
    {
        Assert.instanceOf(newTile, Tile);

        if (this._tiles.has(newTile.position().toString())) {
            throw `Area "${this._name}" already have a tile on position ${newTile.position().toString()}`;
        }

        this._validatePositionBoundaries(newTile);

        this._tiles.set(newTile.position().toString(), newTile);
    }

    /**
     * @param {Player} newPlayer
     */
    spawnPlayer(newPlayer)
    {
        Assert.instanceOf(newPlayer, Player);

        if (this._players.has(newPlayer.id()) === true) {
            throw `Player with id "${newPlayer.id()}" is already present in area "${this._name}"`;
        }

        newPlayer.setStartingPosition(this._spawnPosition);

        this._players.set(newPlayer.id(), newPlayer);
    }

    /**
     * @param {string} playerId
     * @param {Position} newPosition
     */
    movePlayerTo(playerId, newPosition)
    {
        this._playerExists(playerId);
        this._tileExists(newPosition);
        this._isTileWalkable(newPosition);

        let player = this._players.get(playerId);
        let tile = this._tiles.get(newPosition.toString());

        player.move(newPosition, tile.moveSpeedModifier());
    }

    /**
     * @param {Position} newPosition
     * @private
     */
    _isTileWalkable(newPosition)
    {
        if (!this._tiles.get(newPosition.toString()).canWalkOn()) {
            throw `Can't walk on tile on ${newPosition.toString()}`;
        }
    }

    /**
     * @param {Position} newPosition
     * @private
     */
    _tileExists(newPosition)
    {
        if (!this._tiles.has(newPosition.toString())) {
            throw `There is no tile on position ${newPosition.toString()}`;
        }
    }

    /**
     * @param {string} playerId
     * @private
     */
    _playerExists(playerId)
    {
        if (!this._players.has(playerId)) {
            throw `There is no player with id "${playerId}" in area "${this._name}"`;
        }
    }

    /**
     * @param {Tile} newTile
     * @private
     */
    _validatePositionBoundaries(newTile)
    {
        if (newTile.position().x() > this._sizeX || newTile.position().y() > this._sizeY) {
            throw `Area "${this._name}" boundaries are x: ${this._sizeX}, y: ${this._sizeY}. Tile position is ${newTile.position().toString()}`;
        }
    }
}
