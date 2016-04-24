'use strict';

import Assert from 'assert-js';
import SpriteMap from './SpriteMap';
import Size from './Size';
import Tile from './../Map/Tile';
import Sprite from './Sprite';
import Colors from './Colors';
import Font from './Font';
import TilePosition from './Engine/TilePosition';

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
        this._canvas.setAttribute('data-visible-tiles-x', this._visibleTiles.x - this._hiddenTiles * 2);
        this._canvas.setAttribute('data-visible-tiles-y', this._visibleTiles.y - this._hiddenTiles * 2);
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.beginPath();
    }

    /**
     * @param {int} tileX
     * @param {int} tileY
     * @param {Sprite} sprite
     * @param {Size} offset
     */
    drawSprite(tileX, tileY, sprite, offset)
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
    }

    /**
     * @param color
     * @param tileX
     * @param tileY
     * @param offset
     */
    drawPointer(color, tileX, tileY, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.integer(tileX);
        Assert.integer(tileY);

        let tileSize = this.calculateTileSize();

        this._context.beginPath();
        this._context.lineWidth = 2;
        this._context.strokeStyle = color;
        this._context.rect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );
        this._context.stroke();
        this._context.closePath();
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

        this._context.fillStyle = Colors.BLACK;

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getHeight(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getWidth()
        );
    }

    /**
     * @param {int} health
     * @param {int} maxHealth
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawHealthBar(health, maxHealth, tileX, tileY, offset = new Size(0, 0))
    {
        let percentage = health / maxHealth;
        let tileSize = this.calculateTileSize();
        let color = Colors.HP_GREEN;

        if (percentage * 100 < 75) {
            color = Colors.HP_YELLOW;
        }
        if (percentage * 100 < 50) {
            color = Colors.HP_ORANGE;
        }
        if (percentage * 100 < 35) {
            color = Colors.HP_RED;
        }

        this._context.beginPath();
        this._context.fillStyle = Colors.BLACK;
        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() ,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 15,
            tileSize.getWidth(),
            10
        );
        this._context.closePath();

        this._context.beginPath();
        this._context.fillStyle = color;
        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() ,
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 15,
            tileSize.getWidth() * percentage,
            10
        );
        this._context.closePath();

        this._context.beginPath();
        this._context.lineWidth = 1;
        this._context.strokeStyle = Colors.BLACK;
        this._context.rect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 15,
            tileSize.getWidth() * percentage + 1,
            10
        );
        this._context.stroke();
        this._context.closePath();
    }

    /**
     * @param {string} text
     * @param {int} index
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     * @param {Font} font
     */
    drawCharacterMessage(text, index, tileX, tileY, offset = new Size(0, 0), font)
    {
        let tileSize = this.calculateTileSize();
        let topOffset = -(index * (font.size + 8));

        this.text(
            text,
            font,
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + this._calculateTextTileOffset(text, font, tileSize),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 60 + topOffset
        );
    }

    /**
     * @param {string} name
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     * @param {Font} font
     */
    drawCharacterName(name, tileX, tileY, offset, font)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(name);
        Assert.integer(tileX);
        Assert.integer(tileY);
        Assert.instanceOf(offset, Size);
        Assert.instanceOf(font, Font);

        if (tileY < (this._visibleTiles.y - this._hiddenTiles)
            && tileX < (this._visibleTiles.x - this._hiddenTiles)
            && tileX > 0) {

            let tileSize = this.calculateTileSize();

            this.text(
                name,
                font,
                tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + this._calculateTextTileOffset(name, font, tileSize),
                tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() - 38
            );
        }
    }

    /**
     * @param {string} color
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     */
    drawCharacter(color, tileX, tileY, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(color);
        Assert.integer(tileX);
        Assert.integer(tileY);
        Assert.instanceOf(offset, Size);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = color;

        this._context.fillRect(
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );
    }

    /**
     * @param {string} text
     * @param {Font} font
     * @param {int} tileX
     * @param {int} tileY
     * @param {Size} offset
     * @param {Size} textOffset
     * @param {int} position
     */
    textTile(text, font, tileX, tileY, offset, textOffset, position)
    {
        Assert.string(text);
        Assert.instanceOf(font, Font);
        Assert.integer(tileX);
        Assert.integer(tileY);
        Assert.instanceOf(offset, Size);
        Assert.instanceOf(textOffset, Size);
        Assert.integer(position);

        let tileSize = this.calculateTileSize();

        let positionOffset = new Size(0, 0);

        switch (position) {
            case TilePosition.TOP_LEFT:
                break;
            case TilePosition.TOP_MIDDLE:
                positionOffset = new Size(this._calculateTextTileOffset(text, font, tileSize) + textOffset.width, 0);
                break;
            case TilePosition.TOP_RIGHT:
                positionOffset = new Size(tileSize.width, 0);
                break;
            default:
                throw `Tile position ${position} not implemented yet`;
                break;
        }

        this.text(
            text,
            font,
            tileSize.getWidth() * (tileX - this._hiddenTiles) + offset.getWidth() + textOffset.getWidth() + positionOffset.getWidth(),
            tileSize.getHeight() * (tileY - this._hiddenTiles) + offset.getHeight() + textOffset.height + positionOffset.getHeight()
        );
    }

    /**
     * @param {string} text
     * @param {Font} font
     * @param {int} pixelX
     * @param {int} pixelY
     */
    text(text, font, pixelX, pixelY)
    {
        Assert.string(text);
        Assert.instanceOf(font, Font);
        Assert.integer(pixelX);
        Assert.integer(pixelY);

        let outlineSize = 2;

        this._context.textBaseline = 'top';
        this._context.font = `${font.weight} ${font.size}px ${font.name}`;
        this._context.fillStyle = font.colorOutline;
        this._context.fillText(text, pixelX - outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY - outlineSize);
        this._context.fillText(text, pixelX + outlineSize, pixelY);
        this._context.fillText(text, pixelX,   pixelY + outlineSize);

        this._context.fillStyle = font.color;
        this._context.fillText(text, pixelX, pixelY);
        this._context.font = `${font.weight} ${font.size}px ${font.name}`;
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
     * @param {Font§} font
     * @param {Size} tileSize
     * @returns {number}
     * @private
     */
    _calculateTextTileOffset(text, font, tileSize)
    {
        this._context.font = `${font.weight} ${font.size}px ${font.name}`;
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