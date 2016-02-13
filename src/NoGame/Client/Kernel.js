'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';
import Area from './Map/Area';
import Player from './Player';

export default class Kernel
{
    /**
     * @param {Engine} gfxEngine
     */
    constructor(gfxEngine)
    {
        Assert.instanceOf(gfxEngine, Engine);

        this._gfxEngine = gfxEngine;
        this._version = '1.0.0-DEV';
        this._loaded = false;
        this._player = null;
    }

    boot()
    {
        this._gfxEngine.loadSprites();
    }

    draw()
    {
        this._gfxEngine.draw();
    }

    /**
     * @param {Player} player
     */
    login(player)
    {
        Assert.instanceOf(player, Player);

        this._player = player;
        this._gfxEngine.setPlayer(player);
    }

    /**
     * @param {Area} area
     */
    setArea(area)
    {
        Assert.instanceOf(area, Area);

        this._area = area;
        this._gfxEngine.setTiles(this._area.tiles());
    }
}