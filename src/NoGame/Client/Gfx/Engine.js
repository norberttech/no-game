'use strict';

import Assert from './../../../JSAssert/Assert';
import Canvas from './Canvas';
import SpriteMap from './SpriteMap';

export default class Engine
{
    /**
     * @param {Canvas} canvas
     * @param {function} animationFunction
     * @param {SpriteMap} spriteMap
     */
    constructor(canvas, animationFunction, spriteMap)
    {
        Assert.instanceOf(canvas, Canvas);
        Assert.isFunction(animationFunction);
        Assert.instanceOf(spriteMap, SpriteMap);

        this._canvas = canvas;
        this._animationFunction = animationFunction;
        this._spriteMap = spriteMap;
    }

    loadSprites()
    {
        this._spriteMap.load();
    }

    draw()
    {
        if (this._spriteMap.isLoaded()) {
            this._canvas.clear();
            this._canvas.drawGrid();
        }

        this._animationFunction(this.draw.bind(this));
    }
}
