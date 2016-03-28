'use strict';

import Assert from 'assert-js';
import Tile from './Area/Tile';
import Position from './Area/Position';
import Calculator from './../../Common/Area/Calculator';
import Range from './../../Common/Area/Range';
import Utils from './../../Common/Utils';
import Player from './../Player';
import Spawn from './../Spawn';
import MonsterFactory from './../MonsterFactory';

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
     * @param {Position} position
     * @returns {Tile}
     */
    tile(position)
    {
        Assert.instanceOf(position, Position);

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
     * @param {Spawn} spawn
     */
    addSpawn(spawn)
    {
        Assert.instanceOf(spawn, Spawn);

        this._spawns.set(spawn.id, spawn);
    }

    /**
     * @param {MonsterFactory} factory
     * @param {function} onMonsterSpawn
     */
    spawnMonsters(factory, onMonsterSpawn)
    {
        for (let spawn of this._spawns.values()) {
            let spawnAttempt = 0;
            while (spawnAttempt < 10) {
                let position = spawn.randomPosition;

                try {
                    this._tileExists(position);
                    this._isTileWalkable(position);

                    let monster = spawn.spawnMonster(factory, position, spawn.id);
                    let tile = this._tiles.get(position.toString());

                    tile.monsterWalkOn(monster.id);
                    this._monsters.set(monster.id, spawn.id);
                    onMonsterSpawn(monster);
                    break;
                } catch (error) {}

                spawnAttempt++;
            }
        }
    }

    /**
     * @param {function} onMonsterMove
     */
    moveMonsters(onMonsterMove)
    {
        Assert.isFunction(onMonsterMove);

        for (let monsterId of this._monsters.keys()) {
            let monster = this._monster(monsterId);
            let move = false;
            var range = Calculator.visibleTilesRange(
                monster.position.x(),
                monster.position.y(),
                VISIBLE_TILES.x,
                VISIBLE_TILES.y
            );

            for (let tile of this.tilesRange(range)) {
                if (tile.players.length > 0) {
                    move = true;
                    continue ;
                }
            }

            if (move) {
                let newPosition = Position.randomNextTo(monster.position);

                if (!this._canWalkOn(newPosition) || monster.isMoving) {
                    continue ;
                }

                let oldTile = this._tiles.get(monster.position.toString());
                let newTile = this._tiles.get(newPosition.toString());

                oldTile.monsterLeave();
                monster.move(newPosition, newTile.moveSpeedModifier());
                newTile.monsterWalkOn(monsterId);

                onMonsterMove(monster, oldTile.position());
            }
        }
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
            player.currentPosition().x(),
            player.currentPosition().y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        return this.tilesRange(range);
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
            player.currentPosition().x(),
            player.currentPosition().y(),
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
            for (let characterId of tile.players) {
                characters.push(this._characters.get(characterId));
            }
        }

        return characters;
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
            player.currentPosition().x(),
            player.currentPosition().y(),
            VISIBLE_TILES.x,
            VISIBLE_TILES.y
        );

        for (let tile of this.tilesRange(range)) {
            if (!tile.isMonsterOn) {
                continue ;
            }

            monsters.push(this._monster(tile.monster));
        }

        return monsters;
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
        this._tiles.get(newPlayer.currentPosition().toString()).playerWalkOn(newPlayer.id());
    }

    /**
     * @param {string} playerId
     */
    logoutPlayer(playerId)
    {
        this._playerExists(playerId);

        let player = this._characters.get(playerId);
        let tile = this._tiles.get(player.currentPosition().toString());

        tile.playerLeave(playerId);
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
        let oldTile = this._tiles.get(player.currentPosition().toString());
        let newTile = this._tiles.get(newPosition.toString());

        oldTile.playerLeave(playerId);
        player.move(newPosition, newTile.moveSpeedModifier());
        newTile.playerWalkOn(playerId);
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
     * @returns {boolean}
     * @private
     */
    _canWalkOn(newPosition)
    {
        Assert.instanceOf(newPosition, Position);

        return this._tiles.get(newPosition.toString()).canWalkOn();
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
     * @param {string} monsterId
     * @returns {Monster}
     * @private
     */
    _monster(monsterId)
    {
        let spawnId = this._monsters.get(monsterId);

        return this._spawns.get(spawnId).getMonster(monsterId);
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
