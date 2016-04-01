'use strict';

import UUID from 'uuid';
import Assert from 'assert-js'
import Monster from './Monster';
import Position from './Map/Area/Position';
import MoveSpeed from './../Common/MoveSpeed';

const BASE_ATTACK_DELAY = 3000;
const BASE_DEFENCE = 4;
const BASE_ATTACK_POWER = 10;

export default class Player
{
    /**
     * @param {string} name
     * @param {int} health
     * @param {int} maxHealth
     */
    constructor(name, health = 100, maxHealth = 100)
    {
        Assert.string(name);
        Assert.notEmpty(name);
        Assert.greaterThan(0, health);
        Assert.greaterThan(0, maxHealth);

        this._id = UUID.v4();
        this._health = health;
        this._maxHealth = maxHealth;
        this._position = null;
        this._moveEnds = 0;
        this._name = name;
        this._attackedBy = new Map();
        this._lastAttack = 0;
        this._attackedMonster = null;
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
    attackMonster(monsterId)
    {
        Assert.string(monsterId);

        this._attackedMonster = monsterId;
    }

    stopAttack()
    {
        this._attackedMonster = null;
    }

    /**
     * @returns {boolean}
     */
    get isAttacking()
    {
        return this._attackedMonster !== null;
    }

    /**
     * @param {string} monsterId
     * @returns {boolean}
     */
    isAttackingMonster(monsterId)
    {
        Assert.string(monsterId);

        return this._attackedMonster === monsterId;
    }

    /**
     * @returns {null|string}
     */
    get attackedMonster()
    {
        return this._attackedMonster
    }

    /**
     * @param {string} monsterId
     */
    attackedBy(monsterId)
    {
        Assert.string(monsterId);

        this._attackedBy.set(monsterId, monsterId);
    }

    /**
     * @param {string} monsterId
     * @returns {boolean}
     */
    isAttackedBy(monsterId)
    {
        Assert.string(monsterId);

        return this._attackedBy.has(monsterId);
    }

    /**
     * @param {string} monsterId
     */
    removeAttackingMonster(monsterId)
    {
        Assert.string(monsterId);

        this._attackedBy.delete(monsterId);
    }

    /**
     * @returns {string[]}
     */
    get attackedByMonsters()
    {
        return Array.from(this._attackedBy.values());
    }

    /**
     * @returns {int}
     */
    get defence()
    {
        return BASE_DEFENCE;
    }

    get attackPower()
    {
        return BASE_ATTACK_POWER;
    }

    /**
     * @returns {boolean}
     */
    get isExhausted()
    {
        return (new Date().getTime() < this._lastAttack + BASE_ATTACK_DELAY);
    }

    /**
     * @param {Monster} monster
     * @param {function} [onDamage]
     */
    meleeDamageMonster(monster, onDamage = () => {})
    {
        Assert.instanceOf(monster, Monster);

        if (this._attackedMonster !== monster.id) {
            throw `Player ${monster.id} can't be damaged, it wasn't attacked by monster ${this._id}`;
        }

        if (monster.position.calculateDistanceTo(this._position) > 1) {
            throw `Player ${monster.id} can't be damaged, it is too far from monster ${this._id}`;
        }

        if (monster.defence < this.attackPower) {
            monster.damage(this.attackPower - monster.defence);
            onDamage(monster, this.attackPower - monster.defence);
        }

        this._lastAttack = new Date().getTime();
    }
}