'use strict';

const Assert = require('assert-js');
const Logger = require('nogame-common').Logger;
const Loader = require('./Loader');
const Player = require('./Player');
const Area = require('./Map/Area');
const Clock = require('./Clock');
const Position = require('./Map/Area/Position');
const Characters = require('./Characters');
const MonsterFactory = require('./MonsterFactory');

class Kernel
{
    /**
     * @param {Characters} characters
     * @param {Area} area
     * @param {MonsterFactory} monsterFactory
     * @param {Clock} clock
     * @param {Logger} logger
     */
    constructor(characters, area, monsterFactory, clock, logger)
    {
        Assert.instanceOf(area, Area);
        Assert.instanceOf(monsterFactory, MonsterFactory);
        Assert.instanceOf(clock, Clock);
        Assert.instanceOf(characters, Characters);
        Assert.instanceOf(logger, Logger);

        this._version = '1.0.0-DEV';
        this._loaded = false;
        this._area = area;
        this._monsterFactory = monsterFactory;
        this._logger = logger;
        this._clock = clock;
        this._characters = characters;
    }

    boot()
    {
        this._loaded = true;
    }

    /**
     * @returns {Clock}
     */
    get clock()
    {
        return this._clock;
    }

    /**
     * @return {Area}
     */
    get area()
    {
        if (this._area === null) {
            throw `Area not loaded`;
        }

        return this._area;
    }

    /**
     * @param {function} onMonsterSpawn
     */
    spawnMonsters(onMonsterSpawn)
    {
        Assert.isFunction(onMonsterSpawn);

        for (let spawn of this._area.spawns) {
            let spawnAttempt = 0;

            while (spawnAttempt < 10) {
                let position = spawn.randomPosition;

                try {
                    let tile = this._area.tile(position);
                    if (!tile.canWalkOn) {
                        continue ;
                    }

                    let monster = spawn.spawnMonster(this._monsterFactory, position, this._clock);

                    tile.monsterWalkOn(monster.id);
                    this._area.addMonster(monster);
                    onMonsterSpawn(monster);

                    break;
                } catch (error) {}
                spawnAttempt++;
            }
        }
    }

    /**
     * @param {function} onMonsterMove
     * @param {function} onMonsterStopAttack
     */
    moveMonsters(onMonsterMove, onMonsterStopAttack)
    {
        Assert.isFunction(onMonsterMove);
        Assert.isFunction(onMonsterStopAttack);

        for (let monster of this._area.monsters) {
            if (monster.isMoving(this._clock) || !monster.isAttacking) {
                continue ;
            }

            let player = this._area.getPlayer(monster.attackedPlayerId);

            if (!this._area.isPlayerVisibleFrom(monster.attackedPlayerId, monster.position)) {
                monster.stopAttacking();
                onMonsterStopAttack(monster, player);
                player.removeAttackingMonster(monster.id);
                continue ;
            }

            if (monster.position.calculateDistanceTo(player.position) <= 1) {
                continue ;
            }

            let path = this._area.findPath(monster.position, player.position);

            path.shift();

            if (!path.length) {
                return ;
            }

            let newPosition = path[0];

            let oldTile = this._area.tile(monster.position);
            let destination = this._area.tile(newPosition);

            oldTile.monsterLeave();
            monster.move(destination, this._clock);
            onMonsterMove(monster, oldTile.position);
        }
    }

    /**
     * @param {string} playerId
     * @param {Position} position
     */
    movePlayer(playerId, position)
    {
        Assert.string(playerId);
        Assert.instanceOf(position, Position);

        let player = this._area.getPlayer(playerId);

        if (player.isMoving(this._clock)) {
            this._logger.error({msg: 'still moving', player: player});
            return;
        }

        if (player.position.isEqualTo(position)) {
            this._logger.error({msg: 'already on position', player: player});
            return ;
        }

        let oldTile = this._area.tile(player.position);
        let destination = this._area.tile(position);

        if (!destination.canWalkOn) {
            this._logger.error({msg: 'can\'t walk on tile', player: player, position: position});
            throw new Error(`Can't walk on tile ${position.toString()}`);
        }

        oldTile.playerLeave(playerId);
        player.move(destination, this._clock);
    }

    /**
     * @param {function} onMonsterAttack
     */
    chooseMonstersAttackTarget(onMonsterAttack)
    {
        Assert.isFunction(onMonsterAttack);

        for (let monster of this._area.monsters) {
            if (monster.isAttacking) {
                continue ;
            }

            let players = this._area.visiblePlayersFrom(monster.position);

            if (players.length === 0) {
                continue ;
            }

            for (let player of players) {
                let path = this._area.findPath(monster.position, player.position);

                if (!path.length) {
                    continue ;
                }

                monster.attack(players[0].id);
                onMonsterAttack(monster, players[0]);
                players[0].attackedBy(monster.id);

                break;
            }
        }
    }

    /**
     * @param {string} playerId
     * @param {string} monsterId
     */
    playerAttack(playerId, monsterId)
    {
        Assert.string(playerId);
        Assert.string(monsterId);

        let player = this._area.getPlayer(playerId);
        try {
            let monster = this._area.getMonster(monsterId);
            player.attackMonster(monsterId);
        } catch (error) {
            this._logger.error(`monster with id ${monsterId} is already dead.`);
        }
    }

    /**
     * @param {function} onPlayerDamage
     * @param {function} onPlayerParry
     * @param {function} onPlayerDied
     */
    runMonstersAttackTurn(onPlayerDamage, onPlayerParry, onPlayerDied)
    {
        for (let monster of this._area.monsters) {

            /**
             * I was thinking about moving this whole logic into monster object,
             * but this would mean that kernel would need to catch a lot of exceptions
             * (when monster is exhausted, when it's not attacking anybody or when target is too far).
             * I don't think this would be most efficient way to handle monsters attacks
             * so I let Kernel to decide about everything
             */
            if (!monster.isAttacking || monster.isExhausted(this._clock)) {
                continue;
            }

            let player = this._area.getPlayer(monster.attackedPlayerId);

            if (player.position.calculateDistanceTo(monster.position) > 1) {
                continue;
            }

            let damagePower = monster.meleeHit(player.defence, this._clock);

            if (damagePower > 0) {
                let isDeadly = player.health <= damagePower;

                player.damage(damagePower);
                onPlayerDamage(player, damagePower);

                if (isDeadly) {
                    onPlayerDied(player);

                    this._area.removeCharacter(player.id);
                    player.die();
                    this._characters.save(player);
                }
            } else {
                onPlayerParry(player);
            }
        }
    }

    /**
     * @param {function} onMonsterDamage
     * @param {function} onMonsterParry
     * @param {function} onMonsterDied
     */
    runPlayersAttack(onMonsterDamage, onMonsterParry, onMonsterDied)
    {
        for (let player of this._area.players) {
            /**
             * Check runMonstersAttackTurn for some explanations
             */
            if (!player.isAttacking || player.isExhausted(this._clock)) {
                continue ;
            }

            let monster = this._area.getMonster(player.attackedMonster);

            if (player.position.calculateDistanceTo(monster.position) > 1) {
                continue ;
            }

            let damagePower = player.meleeHit(monster.defence, this._clock);

            if (damagePower > 0) {
                monster.damage(damagePower);
                onMonsterDamage(monster, damagePower);

                if (monster.isDead) {
                    onMonsterDied(monster);
                    this._area.removeMonster(monster.id);
                }
            } else {
                onMonsterParry(monster);
            }
        }
    }

    /**
     * @returns {boolean}
     */
    isLoaded()
    {
        return this._loaded;
    }

    /**
     * @param {Player} player
     */
    login(player)
    {
        Assert.instanceOf(player, Player);

        this._area.loginPlayer(player);
    }

    /**
     * @param {string} playerId
     */
    logout(playerId)
    {
        let player = this._area.getPlayer(playerId);

        this._area.logoutPlayer(playerId);

        this._characters.save(player);
    }
}

module.exports = Kernel;