'use strict';

import Assert from './../../../JSAssert/Assert';
import SpriteMap from './SpriteMap';
import Size from './Size';

export default class Canvas
{
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas)
    {
        Assert.instanceOf(canvas, HTMLCanvasElement);

        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        this._visibleTiles = {x: 9, y: 7};
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    drawGrid()
    {
        let tileSize = this.calculateTileSize();

        for (let y = 0; y <= this._visibleTiles.y; y++) {
            this._context.moveTo(0, tileSize.getHeight() * y);
            this._context.lineTo(tileSize.getWidth() * this._visibleTiles.x, tileSize.getHeight() * y);
        }

        for (let x = 0; x <= this._visibleTiles.x; x++) {
            this._context.moveTo(tileSize.getWidth() * x, 0);
            this._context.lineTo(tileSize.getWidth() * x, tileSize.getHeight() * this._visibleTiles.y);
        }

        this._context.lineWidth = 0.5;
        this._context.stroke();
    }

    /**
     * @returns {Size}
     */
    calculateTileSize()
    {
        return new Size(
            Math.floor(this._canvas.width / this._visibleTiles.x),
            Math.floor(this._canvas.height / this._visibleTiles.y)
        );
    }
}