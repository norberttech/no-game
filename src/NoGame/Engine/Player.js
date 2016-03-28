'use strict';

import UUID from 'uuid';
import Assert from 'assert-js'
import Position from './Map/Area/Position';
import MoveSpeed from './../Common/MoveSpeed';

export default class Player
{
    /**
     * @param {string} name
     * @param {number} health
     */
    constructor(name, health = 100)
    {
        Assert.string(name);
        Assert.notEmpty(name);
        Assert.greaterThan(0, health);

        this._id = UUID.v4();
        this._position = null;
        this._moveEnds = 0;
        this._name = name;
        this._attackedBy = new Map();
    }

    /**
     * @returns {string}
     */
    name()
    {
        return this._name;
    }

    /**
     * @returns {string}
     */
    id()
    {
        return this._id;
    }

    /**
     * @param {Position} startingPosition
     */
    setStartingPosition(startingPosition)
    {
        Assert.instanceOf(startingPosition, Position);

        if (this._position instanceof  Position) {
            throw `Starting position can be set only once, when player is spawned in area`;
        }

        this._position = startingPosition;
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
        return (new Date().getTime() < this._moveEnds);
    }

    /**
     * @returns {int}
     */
    moveEnds()
    {
        return this._moveEnds;
    }

    /**
     * @returns {Position}
     */
    get position()
    {
        return this._position;
    }

    /**
     * @param {Position} newPosition
     * @param {number} moveSpeedModifier
     */
    move(newPosition, moveSpeedModifier = 0)
    {
        if (this.isMoving()) {
            return ;
        }

        Assert.instanceOf(newPosition, Position);
        Assert.integer(moveSpeedModifier);

        let distance = this._position.calculateDistanceTo(newPosition);

        if (distance >= 2) {
            throw `Can't move that far`;
        }

        this._moveEnds = new Date().getTime() + MoveSpeed.calculateMoveTime(distance, moveSpeedModifier);
        this._position = newPosition;
    }

    /**
     * @param {string} monsterId
     */
    attackedBy(monsterId)
    {
        this._attackedBy.set(monsterId, monsterId);
    }

    /**
     * @param {string} monsterId
     */
    removeAttackingMonster(monsterId)
    {
        this._attackedBy.delete(monsterId);
    }

    /**
     * @returns {string[]}
     */
    get attackedByMonsters()
    {
        return Array.from(this._attackedBy.values());
    }
}