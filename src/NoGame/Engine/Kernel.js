'use strict';

import Assert from './../../JSAssert/Assert';
import Loader from './Loader';
import ContainerBuilder from './ContainerBuilder';
import ServiceLocator from './../Common/ServiceLocator';
import Player from './Player';

export default class Kernel
{
    constructor()
    {
        this._version = '1.0.0-DEV';
        this._locator = new ServiceLocator(new ContainerBuilder());
        this._loader = new Loader(this._locator);
        this._loaded = false;
    }

    boot()
    {
        this._loader.loadAreas();

        this._loaded = true;
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

        this._locator.get('nogame.map').area().spawnPlayer(player);
    }

    /**
     * @param {string} playerId
     */
    logout(playerId)
    {
        Assert.string(playerId);

        this._locator.get('nogame.map').area().logoutPlayer(playerId);
    }

    /**
     * @param {string} id
     * @return {Area}
     */
    playerArea(id)
    {
        return this._locator.get('nogame.map').area();
    }
}