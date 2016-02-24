'use strict';

import Assert from './../../JSAssert/Assert';
import Logger from './../Common/Logger';
import Loader from './Loader';
import Player from './Player';
import Area from './Map/Area';

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
        this._logger = logger;
    }

    boot()
    {
        Loader.loadAreas(this, this._logger);

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

        this._area.spawnPlayer(player);
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