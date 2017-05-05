'use strict';

const uuid = require('uuid');
const Assert = require('assert-js');
const Position = require('./Map/Area/Position');
const MoveSpeed = require('./../Common/MoveSpeed');
const Tile = require('./Map/Area/Tile');

class Monster
{
    /**
     * @param {string} name
     * @param {int} health
     * @param attackPower
     * @param {int} attackDelay
     * @param {int} defence
     * @param {int} spriteId
     * @param {Position} spawnPosition
     * @param {string} spawnId
     */
    constructor(name, health, attackPower, attackDelay, defence, spriteId, spawnPosition, spawnId)
    {
        Assert.string(name);
        Assert.notEmpty(name);
        Assert.integer(attackPower);
        Assert.integer(attackDelay);
        Assert.integer(defence);
        Assert.greaterThan(0, health);
        Assert.integer(spriteId);
        Assert.instanceOf(spawnPosition, Position);
        Assert.string(spawnId);

        this._id = uuid.v4();
        this._name = name;
        this._health = health;
        this._maxHealth = health;
        this._attackPower = attackPower;
        this._defence = defence;
        this._position = spawnPosition;
        this._moveEnds = 0;
        this._spriteId = spriteId;
        this._spawwnId = spawnId;
        this._attackedPlayerId = null;
        this._attackDelay = attackDelay;
        this._lastAttack = 0;
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
    get maxHealth()
    {
        return this._maxHealth;
    }

    /**
     * @returns {boolean}
     */
    get isDead()
    {
        return this._health === 0;
    }

    /**
     * @returns {int}
     */
    get moveEnds()
    {
        return this._moveEnds;
    }

    /**
     * @returns {boolean}
     */
    get isExhausted()
    {
        return (new Date().getTime() < this._lastAttack + this._attackDelay);
    }

    /**
     * @returns {int}
     */
    get defence()
    {
        return this._defence;
    }

    /**
     * @param {Player} player
     * @returns {Promise}
     */
    meleeDamage(player)
    {
        // there is no player assertion here because for node it would be a circular dependency

        if (this._attackedPlayerId !== player.id) {
            throw `Player ${player.id} can't be damaged, it wasn't attacked by monster ${this._id}`;
        }

        if (player.position.calculateDistanceTo(this._position) > 1) {
            throw `Player ${player.id} can't be damaged, it is too far from monster ${this._id}`;
        }

        this._lastAttack = new Date().getTime();

        return new Promise((resolve, reject) => {
            let power = Math.round((this._attackPower * Math.random()) - (player.defence * Math.random()));

            if (power > 0) {
                player.damage(power);
                resolve({player: player, damage :power});
            } else {
                reject({player: player});
            }
        });
    }

    /**
     * @param {int} damage
     */
    damage(damage)
    {
        Assert.greaterThan(0, damage);

        this._health = this._health - damage;

        if (this._health < 0) {
            this._health = 0;
        }
    }

    /**
     * @param {string} playerId
     */
    attack(playerId)
    {
        Assert.string(playerId);

        this._attackedPlayerId = playerId;
    }

    /**
     * @returns {boolean}
     */
    get isAttacking()
    {
        return this._attackedPlayerId !== null;
    }

    /**
     * @returns {string}
     */
    get attackedPlayerId()
    {
        if (this._attackedPlayerId === null) {
            throw `Monster ${this.name} is not attacking anybody.`;
        }

        return this._attackedPlayerId;
    }

    stopAttacking()
    {
        this._attackedPlayerId = null;
    }

    /**
     * @param {Tile} destination
     */
    move(destination)
    {
        if (this.isMoving) {
            return ;
        }

        Assert.instanceOf(destination, Tile);

        let distance = this.position.calculateDistanceTo(destination.position);

        if (distance >= 2) {
            throw `Can't move that far`;
        }

        this._moveEnds = new Date().getTime() + MoveSpeed.calculateMoveTime(distance, destination.moveSpeedModifier);
        this._position = destination.position;
        destination.monsterWalkOn(this._id);
    }
}

module.exports = Monster;