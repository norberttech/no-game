'use strict';

const Assert = require('assert-js');
const Logger = require('./../Common/Logger');
const Loader = require('./Loader');
const Player = require('./Player');
const Area = require('./Map/Area');
const Clock = require('./Clock');
const Position = require('./Map/Area/Position');
const MonsterFactory = require('./MonsterFactory');

class Kernel
{
    /**
     * @param {Logger} logger
     * @param {Area} area
     * @param {MonsterFactory} monsterFactory
     * @param {Clock} clock
     */
    constructor(logger, area, monsterFactory, clock)
    {
        Assert.instanceOf(logger, Logger);
        Assert.instanceOf(area, Area);
        Assert.instanceOf(monsterFactory, MonsterFactory);
        Assert.instanceOf(clock, Clock);

        this._version = '1.0.0-DEV';
        this._loaded = false;
        this._area = area;
        this._monsterFactory = monsterFactory;
        this._logger = logger;
        this._clock = clock;
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

                    let monster = spawn.spawnMonster(this._monsterFactory, position);

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
            if (monster.isMoving || !monster.isAttacking) {
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
            monster.move(destination);
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

        if (player.isMoving) {
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
            throw `Can't walk on tile ${position.toString()}`;
        }

        oldTile.playerLeave(playerId);
        player.move(destination);
    }

    /**
     * @param {function} onMonsterAttack
     */
    monstersAttack(onMonsterAttack)
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
     * @param {function} onMonsterDamage
     * @param {function} onMonsterParry
     */
    performMeleeDamage(onPlayerDamage, onPlayerParry, onMonsterDamage, onMonsterParry)
    {
        for (let monster of this._area.monsters) {
            if (!monster.isAttacking || monster.isExhausted) {
                continue ;
            }

            let player = this._area.getPlayer(monster.attackedPlayerId);

            if (player.position.calculateDistanceTo(monster.position) > 1) {
                continue ;
            }

            monster.meleeDamage(player).then((result) => {
                onPlayerDamage(result.player, result.damage)
            }).catch((result) => {
                onPlayerParry(result.player);
            });

            if (player.isDead) {
                this._area.removeCharacter(player.id);
            }
        }

        for (let player of this._area.players) {
            if (!player.isAttacking || player.isExhausted) {
                continue ;
            }

            let monster = this._area.getMonster(player.attackedMonster);

            if (player.position.calculateDistanceTo(monster.position) > 1) {
                continue ;
            }

            player.meleeDamageMonster(monster).then((result) => {
                onMonsterDamage(result.monster, result.damage);
            }).catch((result) => {
                onMonsterParry(result.monster);
            });

            if (monster.isDead) {
                this._area.removeMonster(monster.id);
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
        Assert.string(playerId);

        this._area.logoutPlayer(playerId);
    }
}

module.exports = Kernel;