'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';
import Area from './Map/Area';
import Player from './Player';
import Character from './Character';
import Directions from './Directions';

export default class Kernel
{
    /**
     * @param {Engine} gfxEngine
     */
    constructor(gfxEngine)
    {
        Assert.instanceOf(gfxEngine, Engine);

        this._gfxEngine = gfxEngine;
        this._version = '1.0.0-DEV';
        this._player = null;
        this._characters = [];
        this._area = null;
    }

    boot()
    {
        this._gfxEngine.loadSprites();
    }

    /**
     * @returns {Engine}
     */
    getGfx()
    {
        return this._gfxEngine;
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

    draw()
    {
        this._gfxEngine.draw();
    }

    /**
     * @returns {Player}
     */
    player()
    {
        if (null === this._player) {
            throw `Player needs to login first.`;
        }

        return this._player;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} moveTime
     */
    move(x, y, moveTime)
    {
        this.player().startMovingTo(x, y, moveTime);
    }

    cancelMove()
    {
        this._gfxEngine.cancelMove();
    }

    /**
     * @param {Character[]} characters
     */
    setCharacters(characters)
    {
        Assert.containsOnly(characters, Character);

        this._characters = characters;
        this._gfxEngine.setCharacters(characters);
    }

    /**
     * @param {Character} character
     */
    addCharacter(character)
    {
        Assert.instanceOf(character, Character);

        this._characters.push(character);
        this._gfxEngine.setCharacters(this._characters);
    }

    /**
     * @param {string} characterId
     * @return {boolean}
     */
    hasCharacter(characterId)
    {
        Assert.string(characterId);

        for (let character of this._characters) {
            if (character.id() === characterId) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {string} characterId
     * @return {Character}
     */
    character(characterId)
    {
        Assert.string(characterId);

        for (let character of this._characters) {
            if (character.id() === characterId) {
                return character;
            }
        }

        throw `Unknown character with id "${characterId}"`;
    }

    /**
     * @param {string} id
     * @param {int} x
     * @param {int} y
     * @param {int} moveTime
     */
    characterMove(id, x, y, moveTime)
    {
        let character = this.character(id);
        Assert.integer(x);
        Assert.integer(y);
        Assert.integer(moveTime);

        character.startMovingTo(x, y, moveTime);
    }

    /**
     * @param {Player} player
     */
    login(player)
    {
        Assert.instanceOf(player, Player);

        this._player = player;
        this._gfxEngine.setPlayer(player);
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
     * @returns {null|Area}
     */
    area()
    {
        return this._area;
    }
}