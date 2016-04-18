'use strict';

import Assert from 'assert-js';
import Engine from './Gfx/Engine';
import Area from './Map/Area';
import Player from './Player';
import Position from './Position';
import Path from './Path';
import Character from './Character';
import Directions from './Directions';
import PathFinder from './../Common/PathFinder';
import Grid from './../Common/PathFinder/Grid';
import Calculator from './../Common/Area/Calculator';
import Animations from './Gfx/Animations';

export default class Kernel
{
    /**
     * @param {Engine} gfxEngine
     * @param {PathFinder} pathFinder
     */
    constructor(gfxEngine, pathFinder)
    {
        Assert.instanceOf(gfxEngine, Engine);
        Assert.instanceOf(pathFinder, PathFinder);

        this._gfxEngine = gfxEngine;
        this._pathFinder = pathFinder;
        this._version = '1.0.0-DEV';
        this._resetState();
    }

    /**
     * @returns {null|Area}
     */
    get area()
    {
        if (this._area === null) {
            throw `Area is not available in kernel yet.`;
        }

        return this._area;
    }

    /**
     * @returns {Engine}
     */
    get gfx()
    {
        return this._gfxEngine;
    }

    /**
     * @returns {Player}
     */
    get player()
    {
        if (null === this._player) {
            throw `Player needs to login first.`;
        }

        return this._player;
    }

    /**
     * @returns {boolean}
     */
    get hasWalkPath()
    {
        if (this._walkPath !==null && !this._walkPath.hasNextPosition) {
            this._walkPath = null;
        }

        return (this._walkPath !== null);
    }

    /**
     * @returns {Position}
     */
    get nextWalkPathPosition()
    {
        return this._walkPath.nextPosition;
    }

    /**
     * @returns {Character[]}
     */
    get characters()
    {
        return Array.from(this._characters.values());
    }

    boot()
    {
        this._gfxEngine.loadSprites();
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    setVisibleTiles(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._gfxEngine.setVisibleTiles(x, y);
    }

    /**
     * @param {Player} player
     */
    login(player)
    {
        Assert.instanceOf(player, Player);

        this._player = player;
        this._gfxEngine.setPlayer(player);
        this._gfxEngine.startDrawing();
    }

    logout()
    {
        this._gfxEngine.stopDrawing();
        this._resetState();
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} moveTime
     */
    move(x, y, moveTime)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.integer(moveTime);

        this.player.startMovingTo(x, y, moveTime);
    }

    clearWalkPath()
    {
        this._walkPath = null;
    }

    /**
     * @param {Position} position
     */
    setWalkPath(position)
    {
        let visibleTiles = this._gfxEngine.getVisibleTiles();
        let grid = new Grid(visibleTiles.x, visibleTiles.y);
        let centerPosition = Calculator.centerPosition(visibleTiles.x, visibleTiles.y);

        for (let tile of this._area.tiles().values()) {
            grid.addTile(
                tile.x - this._player.position.x + centerPosition.x,
                tile.y - this._player.position.y + centerPosition.y,
                tile.canWalkOn
            );
        }

        try {
            let path = this._pathFinder.findPath(centerPosition.x, centerPosition.y, position.x, position.y, grid);

            this._walkPath = new Path(path, this._player.position, new Position(centerPosition.x, centerPosition.y));
        } catch (e) {
            return ;
        }
    }

    /**
     * @param {Character[]} characters
     */
    updateCharacters(characters)
    {
        Assert.containsOnly(characters, Character);;

        let newCharacters = new Map();
        for (let character of characters) {
            newCharacters.set(character.id, character);
            if (!this._characters.has(character.id)) {
                this.addCharacter(character);
            }
        }

        for (let oldCharacter of this._characters.values()) {
            if (!newCharacters.has(oldCharacter.id)) {
                this._characters.delete(oldCharacter.id);
            }
        }

        this._gfxEngine.setCharacters(Array.from(this._characters.values()));
    }

    /**
     * @param {Character} character
     */
    addCharacter(character)
    {
        Assert.instanceOf(character, Character);

        this._characters.set(character.id, character);

        this._gfxEngine.setCharacters(Array.from(this._characters.values()));
    }

    /**
     * @param {string} characterId
     */
    removeCharacter(characterId)
    {
        Assert.string(characterId);

        this._characters.delete(characterId);

        this._gfxEngine.setCharacters(Array.from(this._characters.values()));
    }

    /**
     * @param {string} characterId
     * @return {boolean}
     */
    hasCharacter(characterId)
    {
        Assert.string(characterId);

        return this._characters.has(characterId);
    }

    /**
     * @param {string} characterId
     * @return {Character}
     */
    getCharacter(characterId)
    {
        Assert.string(characterId);

        if (!this.hasCharacter(characterId)) {
            throw `Unknown character with id "${characterId}"`;
        }

        return this._characters.get(characterId);
    }

    /**
     * @param {string} id
     * @param {int} x
     * @param {int} y
     * @param {int} moveTime
     */
    characterMove(id, x, y, moveTime)
    {
        let character = this.getCharacter(id);
        Assert.integer(x);
        Assert.integer(y);
        Assert.integer(moveTime);

        character.startMovingTo(x, y, moveTime);
    }

    /**
     * @param {int} x
     * @param {int} y
     * @return {boolean}
     */
    canMoveTo(x, y)
    {
        return this._area.canWalkOn(x, y);
    }

    /**
     * @param {Area} area
     */
    setArea(area)
    {
        Assert.instanceOf(area, Area);

        this._area = area;
        this._gfxEngine.setTiles(this._area.tiles());
    }

    /**
     * @param {integer} newValue
     */
    playerLooseHealth(newValue)
    {
        Assert.integer(newValue);

        this._gfxEngine.tileAnimations.add(
            this.player.position.x,
            this.player.position.y,
            Animations.bloodSplashAnimation()
        );

        this.player.changeHealth(newValue);
    }

    /**
     * @param {string} id
     * @param {int} newValue
     */
    characterLooseHealth(id, newValue)
    {
        Assert.string(id);
        Assert.integer(newValue);

        let character = this.getCharacter(id);

        this._gfxEngine.tileAnimations.add(
            character.position.x,
            character.position.y,
            Animations.bloodSplashAnimation()
        );

        character.changeHealth(newValue);
    }

    /**
     * @private
     */
    _resetState()
    {
        this._player = null;
        this._characters = new Map();
        this._area = null;
        this._walkPath = null;
    }
}