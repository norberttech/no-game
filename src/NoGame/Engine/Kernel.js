'use strict';

import Assert from 'assert-js';
import Logger from './../Common/Logger';
import Loader from './Loader';
import Player from './Player';
import Area from './Map/Area';
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

        this._area.spawnMonsters(this._monsterFactory, onMonsterSpawn);
    }

    /**
     * @param {function} onMonsterMove
     * @param {function} onMonsterStopAttacking
     */
    moveMonsters(onMonsterMove, onMonsterStopAttack)
    {
        Assert.isFunction(onMonsterMove);
        Assert.isFunction(onMonsterStopAttack);

        this._area.moveMonsters(onMonsterMove, onMonsterStopAttack)
    }

    /**
     * @param {function} onMonsterAttack
     */
    monstersAttack(onMonsterAttack)
    {
        Assert.isFunction(onMonsterAttack);

        this._area.monstersAttack(onMonsterAttack);
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