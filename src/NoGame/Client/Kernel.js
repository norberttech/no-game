'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';
import Area from './Map/Area';

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
     * @param {string} id
     */
    setUserId(id)
    {
        Assert.string(id);

        this._userId = id;
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