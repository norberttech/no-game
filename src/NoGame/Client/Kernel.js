'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';

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
     * @param {string} name
     * @param {[]} tiles
     */
    setArea(name, tiles)
    {
        Assert.string(name);
        Assert.array(tiles);

        this._gfxEngine
    }
}