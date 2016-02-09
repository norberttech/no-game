'use strict';

import Assert from './../../../JSAssert/Assert';
import SpriteMap from './SpriteMap';
import Size from './Size';
import Tile from './../Map/Tile';
import Sprite from './Sprite';

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
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    drawGrid(sizeX, sizeY)
    {
        let tileSize = this.calculateTileSize(sizeX, sizeY);
        let lineSize = 1;

        this._context.beginPath();
        this._context.strokeStyle = "rgba(0,0,0,0.5)";
        this._context.fillStyle = "rgba(0,0,0,0.5)";
        this._context.lineWidth = lineSize;

        for (let y = 0; y <= sizeY; y++) {
            let xStartPos = 0;
            let yStartPos = (y === 0) ? tileSize.getHeight() * y + lineSize : tileSize.getHeight() * y;
            let xEndPos = tileSize.getWidth() * sizeX;
            let yEndPos = (y === 0) ? tileSize.getHeight() * y + lineSize : tileSize.getHeight() * y;

            this._context.moveTo(xStartPos, yStartPos);
            this._context.lineTo(xEndPos, yEndPos);
        }

        for (let x = 0; x <= sizeX; x++) {
            let xStartPos = (x === 0) ? tileSize.getWidth() * x + lineSize : tileSize.getWidth() * x;
            let yStartPos = 0;
            let xEndPos = (x === 0) ? tileSize.getWidth() * x + lineSize : tileSize.getWidth() * x;
            let yEndPos = tileSize.getHeight() * sizeY;

            this._context.moveTo(xStartPos, yStartPos);
            this._context.lineTo(xEndPos, yEndPos);
        }

        this._context.stroke();
    }

    /**
     * @param {integer} x
     * @param {integer} y
     * @param {Sprite} sprite
     * @param {integer} totalX
     * @param {integer} totalY
     */
    drawTile(x, y, sprite, totalX, totalY)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.instanceOf(sprite, Sprite);
        Assert.integer(totalX);
        Assert.integer(totalY);

        let tileSize = this.calculateTileSize(totalX, totalY);

        this._context.drawImage(
            sprite.img(),
            sprite.offsetX(),
            sprite.offsetY(),
            sprite.width(),
            sprite.height(),
            tileSize.getWidth() * x,
            tileSize.getHeight() * y,
            tileSize.getWidth(),
            tileSize.getHeight()
        );
    }

    /**
     * @returns {Size}
     */
    calculateTileSize(x, y)
    {
        return new Size(
            Math.floor(this._canvas.width / x),
            Math.floor(this._canvas.height / y)
        );
    }
}