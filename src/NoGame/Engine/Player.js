'use strict';

import Assert from './../../JSAssert/Assert'
import Position from './Map/Area/Position';
import UUID from 'uuid';

/**
 * @type {number}
 */
const BASE_MOVE_SPEED_MODIFIER = 100;

/**
 * @type {number}
 */
const BASE_MOVE_TIME = 500;

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
        this._currentPosition = null;
        this._health = health;
        this._moveEnds = 0;
        this._name = name;
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

        if (this._currentPosition instanceof  Position) {
            throw `Starting position can be set only once, when player is spawned in area`;
        }

        this._currentPosition = startingPosition;
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
        return (new Date().getTime() < this._moveEnds);
    }

    /**
     * @returns {Position}
     */
    currentPosition()
    {
        return this._currentPosition;
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

        let distance = this._currentPosition.calculateDistanceTo(newPosition);

        if (distance >= 2) {
            throw `Can't move that far`;
        }

        this._currentPosition = newPosition;
        this._moveEnds = new Date().getTime() + this._calculateMoveTime(distance, moveSpeedModifier);
    }

    /**
     * @param {number} distance
     * @param {number} moveSpeedModifier
     * @returns {number}
     * @private
     */
    _calculateMoveTime(distance, moveSpeedModifier)
    {
        let modifier = BASE_MOVE_SPEED_MODIFIER + moveSpeedModifier;

        return ((distance * BASE_MOVE_TIME * 100) - modifier) / 100;
    }
}