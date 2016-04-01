'use strict';

import Assert from 'assert-js';
import Logger from './../Common/Logger';
import Loader from './Loader';
import Player from './Player';
import Area from './Map/Area';
import Position from './Map/Area/Position';
import MonsterFactory from './MonsterFactory';

export default class Kernel
{
    /**
     * @param {Logger} logger
     */
    constructor(logger)
    {
        Assert.instanceOf(logger, Logger);

        this._version = '1.0.0-DEV';
        this._loaded = false;
        this._area = null;
        this._monsterFactory = null;
        this._logger = logger;
    }

    boot()
    {
        Loader.loadMapArea(this, this._logger);
        Loader.loadMonsterFactory(this, this._logger);

        this.getArea();

        this._loaded = true;
    }

    /**
     * @return {Area}
     */
    getArea()
    {
        if (this._area === null) {
            throw `Area not loaded`;
        }

        return this._area;
    }

    /**
     * @param {Area} area
     */
    setArea(area)
    {
        Assert.instanceOf(area, Area);

        if (this._area !== null && this._loaded) {
            throw `Area already set and kernel already loaded.`;
        }

        this._area = area;
    }

    /**
     * @param {MonsterFactory} factory
     */
    setMonsterFactory(factory)
    {
        this._monsterFactory = factory;
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
                    if (!tile.canWalkOn()) {
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
            let newTile = this._area.tile(newPosition);

            oldTile.monsterLeave();
            monster.move(newPosition, newTile.moveSpeedModifier());
            newTile.monsterWalkOn(monster.id);
            onMonsterMove(monster, oldTile.position());
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

        if (player.isMoving()) {
            this._logger.error({msg: 'still moving', player: player});
            return;
        }

        if (player.position.isEqualTo(position)) {
            this._logger.error({msg: 'already on position', player: player});
            return ;
        }

        let oldTile = this._area.tile(player.position);
        let newTile = this._area.tile(position);

        if (!newTile.canWalkOn()) {
            this._logger.error({msg: 'can\'t walk on tile', player: player, position: position});
            throw `Can't walk on tile ${position.toString()}`;
        }

        oldTile.playerLeave(playerId);
        player.move(position, newTile.moveSpeedModifier());
        newTile.playerWalkOn(playerId);
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

                monster.attack(players[0].id());
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
     * @param {function} onMonsterDamage
     * @param {function} onPlayerDie
     * @param {function} onMonsterDie
     */
    performMeleeDamage(onPlayerDamage, onMonsterDamage, onPlayerDie, onMonsterDie)
    {
        for (let monster of this._area.monsters) {
            if (!monster.isAttacking || monster.isExhausted) {
                continue ;
            }

            let player = this._area.getPlayer(monster.attackedPlayerId);

            if (player.position.calculateDistanceTo(monster.position) > 1) {
                continue ;
            }

            monster.meleeDamage(player, onPlayerDamage);

            if (player.isDead) {
                onPlayerDie(player);
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

            player.meleeDamageMonster(monster, onMonsterDamage);

            if (monster.isDead) {
                onMonsterDie(monster, player);

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