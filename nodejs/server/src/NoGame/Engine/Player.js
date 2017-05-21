'use strict';

const ExperienceCalculator = require('nogame-common').ExperienceCalculator;
const MoveSpeed = require('nogame-common').MoveSpeed;
const Assert = require('assert-js');
const Tile = require('./Map/Area/Tile');
const Monster = require('./Monster');
const Position = require('./Map/Area/Position');
const Clock = require('./Clock');
const Randomizer = require('./Randomizer');

const BASE_ATTACK_DELAY = 3000;
const BASE_DEFENCE = 4;
const BASE_ATTACK_POWER = 20;

class Player
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} experience
     * @param {int} currentHealth
     * @param {int} health
     * @param {Position} position
     * @param {Position} spawnPosition
     */
    constructor(id, name, experience, currentHealth, health, position, spawnPosition)
    {
        Assert.string(id);
        Assert.string(name);
        Assert.notEmpty(name);
        Assert.integer(experience);
        Assert.greaterThan(0, currentHealth);
        Assert.greaterThan(0, health);
        Assert.instanceOf(position, Position);
        Assert.instanceOf(spawnPosition, Position);

        this._id = id;
        this._name = name;
        this._experience = experience;
        this._level = ExperienceCalculator.level(experience);
        this._currentHealth = currentHealth;
        this._health = health;
        this._position = null;
        this._moveEnds = 0;
        this._attackedBy = new Map();
        this._lastAttack = 0;
        this._attackedMonster = null;
        this._position = position;
        this._spawnPosition = spawnPosition;
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
    get name()
    {
        return this._name;
    }

    /**
     * @returns {int}
     */
    get experience()
    {
        return this._experience;
    }

    get level()
    {
        return this._level;
    }

    /**
     * @returns {int}
     */
    get health()
    {
        return this._currentHealth;
    }

    /**
     * @returns {int}
     */
    get maxHealth()
    {
        return this._health;
    }

    /**
     * @returns {boolean}
     */
    get isDead()
    {
        return this._currentHealth === 0;
    }

    die()
    {
        this._position = this._spawnPosition;
        this._currentHealth = this._health;

        // remove some of experience
    }

    /**
     * @returns {int}
     */
    get moveEnds()
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
     * @returns {Position}
     */
    get spawnPosition()
    {
        return this._spawnPosition;
    }

    /**
     * @returns {boolean}
     */
    get isAttacking()
    {
        return this._attackedMonster !== null;
    }

    /**
     * @returns {null|string}
     */
    get attackedMonster()
    {
        return this._attackedMonster
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
     * @param experience
     */
    earnExperience(experience)
    {
        Assert.integer(experience);

        this._experience = this._experience + experience;
        this._level = ExperienceCalculator.level(this._experience);
    }

    /**
     * @param {Clock} clock
     * @returns {boolean}
     */
    isMoving(clock)
    {
        Assert.instanceOf(clock, Clock);

        return (clock.time() < this._moveEnds);
    }

    /**
     * @param {Clock} clock
     * @returns {boolean}
     */
    isExhausted(clock)
    {
        Assert.instanceOf(clock, Clock);

        return (clock.time() < this._lastAttack + BASE_ATTACK_DELAY);
    }

    /**
     * @param {Clock} clock
     * @param {Tile} destination
     */
    move(destination, clock)
    {
        if (this.isMoving(clock)) {
            return ;
        }

        Assert.instanceOf(destination, Tile);
        Assert.instanceOf(clock, Clock);

        let distance = this._position.calculateDistanceTo(destination.position);

        if (distance >= 2) {
            throw `Can't move that far`;
        }

        this._moveEnds = clock.time() + MoveSpeed.calculateMoveTime(distance, destination.moveSpeedModifier);
        this._position = destination.position;
        destination.playerWalkOn(this._id);
    }

    /**
     * @param {int} damage
     */
    damage(damage)
    {
        Assert.greaterThan(0, damage);

        this._currentHealth = this._currentHealth - damage;

        if (this._currentHealth < 0) {
            this._currentHealth = 0;
        }
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
     * @param {string} monsterId
     * @returns {boolean}
     */
    isAttackingMonster(monsterId)
    {
        Assert.string(monsterId);

        return this._attackedMonster === monsterId;
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
     * @param {int} defence
     * @param {Clock} clock
     * @param {Randomizer} randomizer
     * @returns {int}
     */
    meleeHit(defence, clock, randomizer)
    {
        Assert.integer(defence);
        Assert.instanceOf(clock, Clock);
        Assert.instanceOf(randomizer, Randomizer);

        this._lastAttack = clock.time();

        return Math.round((this.attackPower * randomizer.random()) - (defence * randomizer.random()));
    }
}

module.exports = Player;