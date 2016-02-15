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
        this._characters = new Map();
        this._spawnPosition = new Position(0, 0);
    }

    /**
     * @returns {int}
     */
    sizeX()
    {
        return this._sizeX;
    }

    /**
     * @returns {int}
     */
    sizeY()
    {
        return this._sizeY;
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
     * @param {string} playerId
     * @param {int} tilesX
     * @param {int} tilesY
     * @returns {Tile[]}
     */
    visibleTiles(playerId, tilesX, tilesY)
    {
        Assert.oddNumber(tilesX);
        Assert.oddNumber(tilesY);
        this._playerExists(playerId);

        let player = this._characters.get(playerId);
        let tilesRange = {
            x: {
                start: player.currentPosition().x() - ((tilesX - 1) / 2),
                end: player.currentPosition().x() - ((tilesX - 1) / 2) + tilesX
            },
            y: {
                start: player.currentPosition().y() - ((tilesY - 1) / 2),
                end: player.currentPosition().y() - ((tilesY - 1) / 2) + tilesY
            }
        };
        let tiles = [];

        for (let x = tilesRange.x.start; x < tilesRange.x.end; x++) {
            for (let y = tilesRange.y.start; y < tilesRange.y.end; y++) {
                let tile = this._tiles.get(Position.toStringFromNative(x, y));
                tiles.push(tile);
            }
        }

        return tiles;
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

        if (this._characters.has(newPlayer.id()) === true) {
            throw `Player with id "${newPlayer.id()}" is already present in area "${this._name}"`;
        }

        newPlayer.setStartingPosition(this._spawnPosition);

        this._characters.set(newPlayer.id(), newPlayer);
    }

    /**
     * @param {string} playerId
     */
    logoutPlayer(playerId)
    {
        this._playerExists(playerId);

        this._characters.delete(playerId);
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

        let player = this._characters.get(playerId);
        let tile = this._tiles.get(newPosition.toString());

        player.move(newPosition, tile.moveSpeedModifier());
    }

    /**
     * @param {string} playerId
     * @returns {Player}
     */
    player(playerId)
    {
        this._playerExists(playerId);

        return this._characters.get(playerId);
    }

    /**
     * @param playerId
     * @returns {Player[]}
     */
    getVisiblePlayersFor(playerId)
    {
        let players = [];
        this._playerExists(playerId);

        for (let player of this._characters.values()) {
            if (player.id() !== playerId) {
                players.push(player);
            }
        }

        return players;
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
        Assert.string(playerId);

        if (!this._characters.has(playerId)) {
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
