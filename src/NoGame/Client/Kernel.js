'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';
import Area from './Map/Area';
import Player from './Player';
import Character from './Character';

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
     * @param {Character[]} characters
     */
    setCharacters(characters)
    {
        Assert.containsOnly(characters, Character);

        this._characters = characters;
        this._gfxEngine.setCharacters(characters);
    }

    /**
     * @param {string} characterId
     * @param {int} x
     * @param {int} y
     */
    characterMove(characterId, x, y)
    {
        Assert.string(characterId);
        Assert.integer(x);
        Assert.integer(y);

        for (let character of this._characters) {
            if (character.id() === characterId) {
                character.move(x, y);
            }
        }
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