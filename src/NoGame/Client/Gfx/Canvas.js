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
     * @param {int} tileX
     * @param {int} tileY
     * @param {Sprite} sprite
     * @param {Size} offset
     */
    drawTile(tileX, tileY, sprite, offset)
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
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );

        this.debugSmallText(
            `${tileX}:${tileY}`,
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + 8,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() + 8
        );
    }

    /**
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawBlankTile(tileX, tileY, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = '#000000';

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getHeight(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getWidth()
        );

        this.debugSmallText(
            `${tileX}:${tileY}`,
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + 8,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() + 8
        );
    }

    /**
     * @param {string} nick
     * @param {int} tileX
     * @param {int} tileY
     */
    drawPlayer(nick, tileX, tileY)
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
            "20px Verdana",
            "#FFFFFF",
            "#000000",
            tileSize.getWidth() * (tileX - this._hiddenTiles) + this._calculateTextTileOffset(nick, "20px Verdana", tileSize),
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
            "20px Verdana",
            "#FFFFFF",
            "#000000",
            tileSize.getWidth() * (tileX - this._hiddenTiles) + pixelOffsetX + this._calculateTextTileOffset(nick, "20px Verdana", tileSize),
            tileSize.getHeight() * (tileY  - this._hiddenTiles) + pixelOffsetY - 8
        );

        this.debugSmallText(
            `${tileX}:${tileY}`,
            tileSize.getWidth() * (tileX - this._hiddenTiles) + pixelOffsetX + 8,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + pixelOffsetY + 8
        );
    }

    /**
     * @param {string} text
     * @param {int} pixelX
     * @param {int} pixelY
     */
    debugText(text, pixelX, pixelY)
    {
        this.outlineText(
            text,
            "15px Verdana",
            "#FFFFFF",
            "#000000",
            pixelX,
            pixelY
        )
    }

    /**
     * @param {string} text
     * @param {int} pixelX
     * @param {int} pixelY
     */
    debugSmallText(text, pixelX, pixelY)
    {
        this.outlineText(
            text,
            "8px Verdana",
            "#FFFFFF",
            "#000000",
            pixelX,
            pixelY
        )
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
        this._context.fillText(text, pixelX,   pixelY - outlineSize);
        this._context.fillText(text, pixelX + outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY + outlineSize);

        this._context.fillStyle = color;
        this._context.fillText(text, pixelX, pixelY);
        this._context.font = font;
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
     * @param {stirng} font
     * @param {Size} tileSize
     * @returns {number}
     * @private
     */
    _calculateTextTileOffset(text, font, tileSize)
    {
        this._context.font = font;
        let textWidth = this._context.measureText(text).width;

        return (Math.round(tileSize.getWidth() / 2) - Math.round(textWidth / 2));
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