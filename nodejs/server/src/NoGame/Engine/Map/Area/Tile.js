'use strict';

const Assert = require('assert-js');
const Item = require('./Item');
const Position = require('./Position');

class Tile
{
    /**
     * @param {Position} position
     * @param {Item} ground
     * @param {Item[]|array} stack
     * @param {int} [moveSpeedModifier]
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

        for (let item of this._stack) {
            if (item.isBlocking) {
                return false;
            }
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
     * @returns {Array}
     */
    get stack()
    {
        return this._stack;
    }

    /**
     * @param item
     */
    putOnStack(item)
    {
        Assert.instanceOf(item, Item);

        this._stack.push(item);
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
