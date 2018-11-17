'use strict';

const Assert = require('assert-js');
const Item = require('./Item');
const Position = require('./Position');
const TileLayers = require('./TileLayers');

class Tile
{
    /**
     * @param {Position} position
     * @param {Item} ground
     * @param {TileLayers} tileLayers
     * @param {int} moveSpeedModifier
     */
    constructor(position, ground, tileLayers, moveSpeedModifier = 0)
    {
        Assert.instanceOf(position, Position);
        Assert.instanceOf(ground, Item);
        Assert.instanceOf(tileLayers, TileLayers);
        Assert.integer(moveSpeedModifier);

        this._position = position;
        this._ground = ground;
        this._tileLayers = tileLayers;
        this._moveSpeedModifier = moveSpeedModifier;
        this._characters = new Map();
        this._monster = null;
    }

    /**
     * @returns {boolean}
     */
    get canWalkOn()
    {
        if (this._ground.isBlocking) {
            return false;
        }

        if (this._monster !== null) {
            return false;
        }

        if (this._characters.size > 0) {
            return false;
        }

        if (this._tileLayers.isBlocking) {
            return false;
        }

        return true;
    }

    /**
     * @returns {string}
     */
    get monster()
    {
        return this._monster;
    }

    /**
     * @returns {boolean}
     */
    get isMonsterOn()
    {
        return this._monster !== null
    }

    /**
     * @returns {string[]}
     */
    get players()
    {
        return Array.from(this._characters.values());
    }

    /**
     * @returns {Item}
     */
    get ground()
    {
        return this._ground;
    }

    /**
     * @returns {TileLayers}
     */
    get layers()
    {
        return this._tileLayers;
    }

    /**
     * @returns {Position}
     */
    get position()
    {
        return this._position;
    }

    /**
     * @returns {int}
     */
    get moveSpeedModifier()
    {
        return this._moveSpeedModifier;
    }

    /**
     * @param {int} layerIndex
     * @param {Item} item
     */
    addItem(layerIndex, item)
    {
        this._tileLayers.addItem(layerIndex, item);
    }

    /**
     * @param {string} monsterId
     */
    monsterWalkOn(monsterId)
    {
        Assert.string(monsterId);

        this._monster = monsterId;
    }

    monsterLeave()
    {
        this._monster = null;
    }

    /**
     * @param playerId
     */
    playerWalkOn(playerId)
    {
        Assert.string(playerId);

        this._characters.set(playerId, playerId);
    }

    /**
     * @param {string} playerId
     */
    playerLeave(playerId)
    {
        Assert.string(playerId);

        this._characters.delete(playerId);
    }
}

module.exports = Tile;
