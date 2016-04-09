'use strict';

import Assert from 'assert-js';
import Tile from './Area/Tile';
import Position from './Area/Position';
import Calculator from './../../Common/Area/Calculator';
import Range from './../../Common/Area/Range';
import Utils from './../../Common/Utils';
import PathFinder from './../../Common/PathFinder';
import Grid from './../../Common/PathFinder/Grid';

import Player from './../Player';
import Spawn from './../Spawn';
import Monster from './../Monster';

/**
 * Client displays x: 15 and y: 11 but it keeps 2 tiles hidden.
 *
 * @type {{x: number, y: number}}
 */
const VISIBLE_TILES = {x: 17, y: 13};

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
        this._spawns = new Map();
        this._monsters = new Map();
        this._spawnPosition = new Position(0, 0);
        this._pathFinder = new PathFinder();
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * @returns {int}
     */
    static get visibleX()
    {
        return VISIBLE_TILES.x;
    }

    /**
     * @returns {int}
     */
    static get visibleY()
    {
        return VISIBLE_TILES.y;
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
     * @returns {Player[]}
     */
    get players()
    {
        return Array.from(this._characters.values());
    }

    /**
     * @param {string} playerId
     * @returns {Player}
     */
    getPlayer(playerId)
    {
        if (!this._characters.has(playerId)) {
            throw `Player with id ${playerId} does not exists.`;
        }

        return this._characters.get(playerId);
    }

    /**
     * @param {string} playerId
     * @returns {Player[]}
     */
    visiblePlayersFor(playerId)
    {
        this._playerExists(playerId);

        let characters = [];
        let player = this._characters.get(playerId);
        var range = Calculator.visibleTilesRange(
            player.position.x(),
            player.position.y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        for (let tile of this.tilesRange(range)) {
            for (let characterId of tile.players) {
                if (characterId === playerId) {
                    continue;
                }

                characters.push(this._characters.get(characterId));
            }
        }

        return characters;
    }

    /**
     * @param {string} playerId
     * @param {Position} position
     * @returns {boolean}
     */
    isPlayerVisibleFrom(playerId, position)
    {
        Assert.string(playerId);
        Assert.instanceOf(position, Position);

        var range = Calculator.visibleTilesRange(
            position.x(),
            position.y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        for (let tile of this.tilesRange(range)) {
            for (let characterId of tile.players) {
                if (characterId === playerId) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @param {Position} position
     * @returns {Player[]}
     */
    visiblePlayersFrom(position)
    {
        Assert.instanceOf(position, Position);

        let characters = [];
        var range = Calculator.visibleTilesRange(
            position.x(),
            position.y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        for (let tile of this.tilesRange(range)) {
            for (let playerId of tile.players) {
                characters.push(this._characters.get(playerId));
            }
        }

        return characters;
    }


    /**
     * @param {Player} newPlayer
     */
    loginPlayer(newPlayer)
    {
        Assert.instanceOf(newPlayer, Player);

        if (this._characters.has(newPlayer.id()) === true) {
            throw `Player with id "${newPlayer.id()}" is already present in area "${this._name}"`;
        }

        newPlayer.setStartingPosition(this._spawnPosition);

        this._characters.set(newPlayer.id(), newPlayer);
        this._tiles.get(newPlayer.position.toString()).playerWalkOn(newPlayer.id());
    }

    /**
     * @param {string} playerId
     */
    logoutPlayer(playerId)
    {
        this._playerExists(playerId);

        let player = this._characters.get(playerId);
        let tile = this._tiles.get(player.position.toString());

        for (let monsterId of player.attackedByMonsters) {
            let monster = this.getMonster(monsterId);

            monster.stopAttacking();
            player.removeAttackingMonster(monsterId);
        }

        tile.playerLeave(playerId);
        this._characters.delete(playerId);
    }

    /**
     * @param {Position} position
     * @returns {Tile}
     */
    tile(position)
    {
        Assert.instanceOf(position, Position);

        if (!this._tiles.has(position.toString())) {
            throw `There is no tile on position ${position.toString()}`;
        }

        return this._tiles.get(position.toString());
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
     * @param {Range} range
     */
    tilesRange(range)
    {
        Assert.instanceOf(range, Range);

        let tiles = [];

        for (let x = range.startX; x <= range.endX; x++) {
            for (let y = range.startY; y <= range.endY; y++) {
                let tile = this._tiles.get(Position.toStringFromNative(x, y));

                if (tile !== undefined) {
                    tiles.push(tile);
                }
            }
        }

        return tiles;
    }

    /**
     * @param {string} playerId
     * @returns {Tile[]}
     */
    visibleTilesFor(playerId)
    {
        this._playerExists(playerId);

        let player = this._characters.get(playerId);
        var range = Calculator.visibleTilesRange(
            player.position.x(),
            player.position.y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        return this.tilesRange(range);
    }

    /**
     * @param {Position} position
     * @returns {Tile[]}
     */
    visibleTilesFrom(position)
    {
        Assert.instanceOf(position, Position);

        var range = Calculator.visibleTilesRange(
            position.x(),
            position.y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        return this.tilesRange(range);
    }

    /**
     * @param {Spawn} spawn
     */
    addSpawn(spawn)
    {
        Assert.instanceOf(spawn, Spawn);

        this._spawns.set(spawn.id, spawn);
    }

    /**
     * @returns {Spawn[]}
     */
    get spawns()
    {
        return Array.from(this._spawns.values());
    }

    /**
     * @returns {Monster[]}
     */
    get monsters()
    {
        let monsters = [];
        for (let monsterId of this._monsters.keys()) {
            monsters.push(this.getMonster(monsterId));
        }

        return monsters;
    }

    /**
     * @param {string} monsterId
     * @returns {Monster}
     */
    getMonster(monsterId)
    {
        let spawnId = this._monsters.get(monsterId);

        return this._spawns.get(spawnId).getMonster(monsterId);
    }

    /**
     * @param {Monster} monster
     */
    addMonster(monster)
    {
        Assert.instanceOf(monster, Monster);

        this._monsters.set(monster.id, monster.spawnId);
    }

    /**
     * @param {string} monsterId
     */
    removeMonster(monsterId)
    {
        let monster = this.getMonster(monsterId);

        let tile = this._tiles.get(monster.position.toString());
        tile.monsterLeave();

        for (let player of this._characters.values()) {
            if (player.isAttackingMonster(monster.id)) {
                player.stopAttack();
            }

            if (player.isAttackedBy(monster.id)) {
                player.removeAttackingMonster(monster.id);
            }
        }

        this._monsters.delete(monsterId);

        this._spawns.get(monster.spawnId).removeMonster(monsterId);
    }

    /**
     * @param {string} playerId
     * @returns {Array}
     */
    visibleMonstersFor(playerId)
    {
        this._playerExists(playerId);

        let monsters = [];
        let player = this._characters.get(playerId);
        var range = Calculator.visibleTilesRange(
            player.position.x(),
            player.position.y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        for (let tile of this.tilesRange(range)) {
            if (!tile.isMonsterOn) {
                continue ;
            }

            monsters.push(this.getMonster(tile.monster));
        }

        return monsters;
    }

    /**
     * @param {Position} fromPosition
     * @param {Position} toPosition
     * @returns {Position[]}
     */
    findPath(fromPosition, toPosition)
    {
        let grid = new Grid(VISIBLE_TILES.x, VISIBLE_TILES.y);
        let centerPosition = {
            x: (VISIBLE_TILES.x - 1) / 2,
            y: (VISIBLE_TILES.y - 1) / 2
        };

        for (let tile of this.visibleTilesFrom(fromPosition)) {

            let walkable = tile.canWalkOn();

            if (tile.position().isEqualTo(toPosition)) {
                walkable = true;
            }

            if (tile.position().isEqualTo(fromPosition)) {
                walkable = true;
            }

            grid.addTile(
                tile.position().x() - fromPosition.x() + centerPosition.x,
                tile.position().y() - fromPosition.y() + centerPosition.y,
                walkable
            );
        }

        try {
            let path = this._pathFinder.findPath(
                centerPosition.x,
                centerPosition.y,
                centerPosition.x - (fromPosition.x() - toPosition.x()),
                centerPosition.y - (fromPosition.y() - toPosition.y()),
                grid
            );

            return path.map(function(pathNode) {
                return new Position(
                    fromPosition.x() - (centerPosition.x - pathNode.x),
                    fromPosition.y() - (centerPosition.y - pathNode.y)
                )
            });
        } catch(error) { return []}
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
