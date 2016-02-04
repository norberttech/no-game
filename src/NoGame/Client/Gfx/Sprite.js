'use strict';

import Assert from './../../../JSAssert/Assert';
import Size from './../Gfx/Size';

export default class Sprite
{
    /**
     * @param {string} name
     * @param {string} path
     * @param {int} tilesX
     * @param {int} tilesY
     */
    constructor(name, tilesX, tilesY)
    {
        Assert.string(name);
        Assert.string(path);
        Assert.greaterThan(0, tilesX);
        Assert.greaterThan(0, tilesY);

        this._name = name;
        this._path = path;
        this._tilesX = tilesX;
        this._tilesY = tilesY;
    }
}