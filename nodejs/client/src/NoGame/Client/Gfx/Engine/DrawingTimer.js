'use strict';

const Assert = require('assert-js');

class DrawingTimer
{
    constructor()
    {
        this._lastDraw = 0;
    }

    start()
    {
        this._lastDraw = new Date().getTime();
    }

    stop()
    {
        this._lastDraw = 0;
    }

    draw(callback)
    {
        Assert.isFunction(callback);

        callback();
        this._lastDraw = new Date().getTime();

    }

    get realFPS()
    {
        return Math.round(1000 / Math.abs(new Date().getTime() - this._lastDraw));
    }

    /**
     * @returns {integer}
     */
    get fps()
    {
        return Math.round( this.realFPS  / 5) * 5;
    }
}

module.exports = DrawingTimer;