'use strict';

import Assert from './../../../JSAssert/Assert';
import Canvas from './Canvas';

class Engine
{
    /**
     * @param {Canvas} canvas
     * @param {function} animationFunction
     */
    constructor(canvas, animationFunction)
    {
        Assert.instanceOf(canvas, Canvas);
        Assert.isFunction(animationFunction);

        this._canvas = canvas;
        this._animationFunction = animationFunction;
    }
}

Engine.prototype.draw = function()
{
    this._canvas.clear();
    this._animationFunction(this.draw.bind(this));
};

export default Engine;