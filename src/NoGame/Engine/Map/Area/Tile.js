'use strict';

import Assert from 'assert-js';
import Item from './Item';
import Position from './Position';
import Monster from './../../Monster'

export default class Tile
{
    /**
     * @param {Position} position
     * @param {Item} ground
     * @param {Item[]} stack
     * @param {integer} [moveSpeedModifier]
     */
    constructor(position, ground, stack = [], moveSpeedModifier = 0)
    {
        Assert.instanceOf(position, Position);
        Assert.instanceOf(ground, Item);
        Assert.containsOnly(stack, Item);
        Assert.integer(moveSpeedModifier);

        this._position = position;
        this._ground = ground;
        this._stack = stack;
        this._moveSpeedModifier = 0;
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

        for (let item of this._stack) {
            if (item.isBlocking) {
                return false;
            }
        }

        return true;
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
     * @returns {Position}
     */
    get position()
    {
        return this._position;
    }

    /**
     * @returns {number}
     */
    get moveSpeedModifier()
    {
        return this._moveSpeedModifier;
    }
}
