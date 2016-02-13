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
        this._visibleTiles = {x: 15, y: 11};
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    setVisibleTiles(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._visibleTiles = {x: x, y: y};
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    drawGrid()
    {
        let tileSize = this.calculateTileSize();
        let lineSize = 1;

        this._context.beginPath();
        this._context.strokeStyle = "rgba(0,0,0,0.5)";
        this._context.fillStyle = "rgba(0,0,0,0.5)";
        this._context.lineWidth = lineSize;

        for (let y = 0; y <= this._visibleTiles.y; y++) {
            let xStartPos = 0;
            let yStartPos = (y === 0) ? tileSize.getHeight() * y + lineSize : tileSize.getHeight() * y;
            let xEndPos = tileSize.getWidth() * this._visibleTiles.x;
            let yEndPos = (y === 0) ? tileSize.getHeight() * y + lineSize : tileSize.getHeight() * y;

            this._context.moveTo(xStartPos, yStartPos);
            this._context.lineTo(xEndPos, yEndPos);
        }

        for (let x = 0; x <= this._visibleTiles.x; x++) {
            let xStartPos = (x === 0) ? tileSize.getWidth() * x + lineSize : tileSize.getWidth() * x;
            let yStartPos = 0;
            let xEndPos = (x === 0) ? tileSize.getWidth() * x + lineSize : tileSize.getWidth() * x;
            let yEndPos = tileSize.getHeight() * this._visibleTiles.y;

            this._context.moveTo(xStartPos, yStartPos);
            this._context.lineTo(xEndPos, yEndPos);
        }

        this._context.stroke();
    }

    /**
     * @param {integer} x
     * @param {integer} y
     * @param {Sprite} sprite
     */
    drawTile(x, y, sprite)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.instanceOf(sprite, Sprite);

        let tileSize = this.calculateTileSize();

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
     * @param {int} x
     * @param {int} y
     */
    drawBlankTile(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#000000';

        this._context.fillRect(
            tileSize.getWidth() * x,
            tileSize.getHeight() * y,
            tileSize.getWidth(),
            tileSize.getWidth()
        );
    }

    /**
     * @param {string} nick
     * @param {int} x
     * @param {int} y
     */
    drawPLayer(nick, x, y)
    {
        Assert.string(nick);
        Assert.integer(x);
        Assert.integer(y);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#FF0000';

        this._context.fillRect(
            tileSize.getWidth() * x,
            tileSize.getHeight() * y,
            tileSize.getWidth(),
            tileSize.getWidth()
        );

        this._context.fillStyle = '#EDE624';
        this._context.font = "25px Arial";
        this._context.fillText(
            nick,
            tileSize.getWidth() * x - 10,
            tileSize.getHeight() * y - 5
        );
    }

    /**
     * @param {string} nick
     * @param {int} x
     * @param {int} y
     */
    drawCharacter(nick, x, y)
    {
        Assert.string(nick);
        Assert.integer(x);
        Assert.integer(y);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#44BBE3';

        this._context.fillRect(
            tileSize.getWidth() * x,
            tileSize.getHeight() * y,
            tileSize.getWidth(),
            tileSize.getWidth()
        );

        this._context.fillStyle = '#EDE624';
        this._context.font = "25px Arial";
        this._context.fillText(
            nick,
            tileSize.getWidth() * x - 10,
            tileSize.getHeight() * y - 5
        );
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