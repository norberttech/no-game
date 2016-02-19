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
        this._visibleTiles = null;
        this._hiddenTiles = null;
    }

    /**
     * @param {int} tilesX
     * @param {int} tilesY
     * @param {int} hiddenTiles
     */
    setVisibleTiles(tilesX, tilesY, hiddenTiles)
    {
        Assert.integer(tilesX);
        Assert.integer(tilesY);
        Assert.integer(hiddenTiles);

        this._visibleTiles = {x: tilesX, y: tilesY};
        this._hiddenTiles = hiddenTiles;
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    /**
     * @param {integer} tileX
     * @param {integer} tileY
     * @param {Sprite} sprite
     * @param {int} offsetPixelX
     * @param {int} offsetPixelY
     */
    drawTile(tileX, tileY, sprite, offsetPixelX, offsetPixelY)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);
        Assert.instanceOf(sprite, Sprite);

        let tileSize = this.calculateTileSize();

        this._context.drawImage(
            sprite.img(),
            sprite.offsetX(),
            sprite.offsetY(),
            sprite.width(),
            sprite.height(),
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offsetPixelX,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offsetPixelY,
            tileSize.getWidth(),
            tileSize.getHeight()
        );
    }

    /**
     * @param {int} tileX
     * @param {int} tileY
     * @param {int} pixelOffsetX
     * @param {int} pixelOffsetY
     */
    drawBlankTile(tileX, tileY, pixelOffsetX, pixelOffsetY)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#000000';

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + pixelOffsetX,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + pixelOffsetY,
            tileSize.getWidth(),
            tileSize.getWidth()
        );
    }

    /**
     * @param {string} nick
     * @param {int} tileX
     * @param {int} tileY
     */
    drawPLayer(nick, tileX, tileY)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(nick);
        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#FF0000';

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles),
            tileSize.getHeight() * (tileY - this._hiddenTiles),
            tileSize.getWidth(),
            tileSize.getHeight()
        );

        this.outlineText(
            nick,
            "20px Arial",
            "#FFFFFF",
            "#000000",
            tileSize.getWidth() * (tileX - this._hiddenTiles) + this._calculateTextTileOffset(nick, tileSize),
            tileSize.getHeight() * (tileY - this._hiddenTiles) - 8
        );
    }

    /**
     * @param {string} nick
     * @param {int} tileX
     * @param {int} tileY
     * @param {int} pixelOffsetX
     * @param {int} pixelOffsetY
     */
    drawCharacter(nick, tileX, tileY, pixelOffsetX, pixelOffsetY)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(nick);
        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#44BBE3';

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + pixelOffsetX,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + pixelOffsetY,
            tileSize.getWidth(),
            tileSize.getHeight()
        );

        this.outlineText(
            nick,
            "20px Arial",
            "#FFFFFF",
            "#000000",
            tileSize.getWidth() * (tileX - this._hiddenTiles) + pixelOffsetX + this._calculateTextTileOffset(nick, tileSize),
            tileSize.getHeight() * (tileY  - this._hiddenTiles) +pixelOffsetY - 8
        );
    }


    /**
     * @param {string} text
     * @param {string} font
     * @param {string} color
     * @param {string} outlineColor
     * @param {int} pixelX
     * @param {int} pixelY
     */
    outlineText(text, font, color, outlineColor, pixelX, pixelY)
    {
        let outlineSize = 2;

        this._context.font = font;
        this._context.fillStyle = outlineColor;
        this._context.fillText(text, pixelX - outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY-outlineSize);
        this._context.fillText(text, pixelX + outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY+outlineSize);

        this._context.fillStyle = color;
        this._context.fillText(text, pixelX, pixelY);
    }

    /**
     * @returns {Size}
     */
    calculateTileSize()
    {
        return new Size(
            Math.round(this._canvas.getAttribute('width') / (this._visibleTiles.x - (this._hiddenTiles * 2))),
            Math.round(this._canvas.getAttribute('height') / (this._visibleTiles.y - (this._hiddenTiles * 2)))
        );
    }

    /**
     * @param {string} text
     * @param {Size} tileSize
     * @returns {number}
     * @private
     */
    _calculateTextTileOffset(text, tileSize)
    {
        let textWidth = this._context.measureText(text);

        return (Math.round(tileSize.getWidth() / 2) - Math.round(textWidth.width / 2));
    }

    /**
     * @returns {boolean}
     * @private
     */
    _canDraw()
    {
        return null !== this._visibleTiles;
    }
}