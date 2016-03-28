'use strict';

import UUID from 'uuid';
import Assert from 'assert-js'
import Position from './Map/Area/Position';
import MoveSpeed from './../Common/MoveSpeed';

export default class Monster
{
    /**
     * @param {string} name
     * @param {int} health
     * @param {int} spriteId
     * @param {Position} spawnPosition
     * @param {string} spawnId
     */
    constructor(name, health, spriteId, spawnPosition, spawnId)
    {
        Assert.string(name);
        Assert.notEmpty(name);
        Assert.greaterThan(0, health);
        Assert.integer(spriteId);
        Assert.instanceOf(spawnPosition, Position);
        Assert.string(spawnId);

        this._id = UUID.v4();
        this._name = name;
        this._health = health;
        this._maximumHealth = health;
        this._position = spawnPosition;
        this._moveEnds = 0;
        this._spriteId = spriteId;
        this._spawwnId = spawnId;
    }

    /**
     * @returns {string}
     */
    get id()
    {
        return this._id;
    }

    /**
     * @returns {string}
     */
    get spawnId()
    {
        return this._spawwnId;
    }

    /**
     * @returns {int}
     */
    get spriteId()
    {
        return this._spriteId;
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * @returns {boolean}
     */
    get isMoving()
    {
        return (new Date().getTime() < this._moveEnds);
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
    get health()
    {
        return this._health;
    }

    /**
     * @returns {int}
     */
    get maximumHealth()
    {
        return this._maximumHealth;
    }

    /**
     * @returns {int}
     */
    get moveEnds()
    {
        return this._moveEnds;
    }

    /**
     * @param {Position} newPosition
     * @param {number} moveSpeedModifier
     */
    move(newPosition, moveSpeedModifier = 0)
    {
        if (this.isMoving) {
            return ;
        }

        Assert.instanceOf(newPosition, Position);
        Assert.integer(moveSpeedModifier);

        let distance = this.position.calculateDistanceTo(newPosition);

        if (distance >= 2) {
            throw `Can't move that far`;
        }

        this._moveEnds = new Date().getTime() + MoveSpeed.calculateMoveTime(distance, moveSpeedModifier);
        this._position = newPosition;
    }
}