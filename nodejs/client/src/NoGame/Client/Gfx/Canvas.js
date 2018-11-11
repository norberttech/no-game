'use strict';

const Assert = require('assert-js');
const Size = require('./Size');
const Sprite = require('./Sprite');
const Colors = require('./Colors');
const Font = require('./Font');
const TilePosition = require('./Engine/TilePosition');
const VisibleTiles = require('./../VisibleTiles');
const RelativePosition = require('./../RelativePosition');

class Canvas
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
    }

    /**
     * @param {VisibleTiles} visibleTiles
     */
    setVisibleTiles(visibleTiles)
    {
        Assert.instanceOf(visibleTiles, VisibleTiles);

        this._visibleTiles = visibleTiles;

        this._canvas.setAttribute('data-visible-tiles-x', this._visibleTiles.sizeX - this._visibleTiles.marginSize * 2);
        this._canvas.setAttribute('data-visible-tiles-y', this._visibleTiles.sizeY - this._visibleTiles.marginSize * 2);
    }

    clear()
    {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.beginPath();
    }

    /**
     * @param {RelativePosition} position
     * @param {Sprite} sprite
     * @param {Size} offset
     */
    drawSprite(position, sprite, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.instanceOf(position, RelativePosition);
        Assert.instanceOf(sprite, Sprite);

        let tileSize = this.calculateTileSize();

        this._context.drawImage(
            sprite.img(),
            sprite.offsetX(),
            sprite.offsetY(),
            sprite.width(),
            sprite.height(),
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth(),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );
    }

    /**
     * @param color
     * @param {RelativePosition} position
     * @param offset
     */
    drawPointer(color, position, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.instanceOf(position, RelativePosition);

        let tileSize = this.calculateTileSize();

        this._context.beginPath();
        this._context.lineWidth = 2;
        this._context.strokeStyle = color;
        this._context.rect(
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth(),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );
        this._context.stroke();
        this._context.closePath();
    }

    /**
     * @param {RelativePosition} position
     * @param {Size} offset
     */
    drawBlankTile(position, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.instanceOf(position, RelativePosition);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = Colors.BLACK;

        this._context.fillRect(
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getHeight(),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getWidth()
        );
    }

    /**
     * @param {int} health
     * @param {int} maxHealth
     * @param {RelativePosition} position
     * @param {Size} [offset]
     */
    drawHealthBar(health, maxHealth, position, offset = new Size(0, 0))
    {
        Assert.instanceOf(position, RelativePosition);

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
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth() ,
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight() - 15,
            tileSize.getWidth(),
            10
        );
        this._context.closePath();

        this._context.beginPath();
        this._context.fillStyle = color;
        this._context.fillRect(
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth() ,
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight() - 15,
            tileSize.getWidth() * percentage,
            10
        );
        this._context.closePath();

        this._context.beginPath();
        this._context.lineWidth = 1;
        this._context.strokeStyle = Colors.BLACK;
        this._context.rect(
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth(),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight() - 15,
            tileSize.getWidth() * percentage + 1,
            10
        );
        this._context.stroke();
        this._context.closePath();
    }

    /**
     * @param {string} text
     * @param {int} index
     * @param {RelativePosition} position
     * @param {Size} offset
     * @param {Font} font
     */
    drawCharacterMessage(text, index, position, offset = new Size(0, 0), font)
    {
        Assert.instanceOf(position, RelativePosition);

        let tileSize = this.calculateTileSize();
        let topOffset = -(index * (font.size + 8));

        this.text(
            text,
            font,
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth() + this._calculateTextTileOffset(text, font, tileSize),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight() - 60 + topOffset
        );
    }

    /**
     * @param {string} name
     * @param {RelativePosition} position
     * @param {Size} offset
     * @param {Font} font
     */
    drawCharacterName(name, position, offset, font)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(name);
        Assert.instanceOf(position, RelativePosition);
        Assert.instanceOf(offset, Size);
        Assert.instanceOf(font, Font);

        if (position.y < (this._visibleTiles.sizeY - this._visibleTiles.marginSize)
            && position.x < (this._visibleTiles.sizeX - this._visibleTiles.marginSize)
            && position.x > 0) {

            let tileSize = this.calculateTileSize();

            this.text(
                name,
                font,
                tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth() + this._calculateTextTileOffset(name, font, tileSize),
                tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight() - 38
            );
        }
    }

    /**
     * @param {string} color
     * @param {RelativePosition} position
     * @param {Size} offset
     */
    drawCharacter(color, position, offset)
    {
        if (!this._canDraw()) {
            return ;
        }

        Assert.string(color);
        Assert.instanceOf(position, RelativePosition);
        Assert.instanceOf(offset, Size);

        let tileSize = this.calculateTileSize();

        this._context.fillStyle = color;

        this._context.fillRect(
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth(),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight(),
            tileSize.getWidth(),
            tileSize.getHeight()
        );
    }

    /**
     * @param {string} text
     * @param {Font} font
     * @param {RelativePosition} position
     * @param {Size} offset
     * @param {Size} textOffset
     * @param {int} positionOnTile
     */
    textTile(text, font, position, offset, textOffset, positionOnTile)
    {
        Assert.string(text);
        Assert.instanceOf(font, Font);
        Assert.instanceOf(position, RelativePosition);
        Assert.instanceOf(offset, Size);
        Assert.instanceOf(textOffset, Size);
        Assert.integer(positionOnTile);

        let tileSize = this.calculateTileSize();

        let positionOffset = new Size(0, 0);

        switch (positionOnTile) {
            case TilePosition.TOP_LEFT:
                break;
            case TilePosition.TOP_MIDDLE:
                positionOffset = new Size(this._calculateTextTileOffset(text, font, tileSize) + textOffset.width, 0);
                break;
            case TilePosition.TOP_RIGHT:
                positionOffset = new Size(tileSize.width, 0);
                break;
            default:
                throw `Tile position ${positionOnTile} not implemented yet`;
                break;
        }

        this.text(
            text,
            font,
            tileSize.getWidth() * (position.x - this._visibleTiles.marginSize) + offset.getWidth() + textOffset.getWidth() + positionOffset.getWidth(),
            tileSize.getHeight() * (position.y - this._visibleTiles.marginSize) + offset.getHeight() + textOffset.height + positionOffset.getHeight()
        );
    }

    /**
     * @param {string} text
     * @param {Font} font
     * @param {int} pixelPositionX
     * @param {int} pixelPositionY
     */
    text(text, font, pixelPositionX, pixelPositionY)
    {
        Assert.string(text);
        Assert.instanceOf(font, Font);
        Assert.integer(pixelPositionX);
        Assert.integer(pixelPositionY);

        let outlineSize = 2;

        this._context.textBaseline = 'top';
        this._context.font = `${font.weight} ${font.size}px ${font.name}`;
        this._context.fillStyle = font.colorOutline;
        this._context.fillText(text, pixelPositionX - outlineSize, pixelPositionY);
        this._context.fillText(text, pixelPositionX,   pixelPositionY - outlineSize);
        this._context.fillText(text, pixelPositionX + outlineSize, pixelPositionY);
        this._context.fillText(text, pixelPositionX,   pixelPositionY + outlineSize);

        this._context.fillStyle = font.color;
        this._context.fillText(text, pixelPositionX, pixelPositionY);
        this._context.font = `${font.weight} ${font.size}px ${font.name}`;
    }

    /**
     * @returns {Size}
     */
    calculateTileSize()
    {
        return new Size(
            Math.round(this._canvas.getAttribute('width') / (this._visibleTiles.sizeX - (this._visibleTiles.marginSize * 2))),
            Math.round(this._canvas.getAttribute('height') / (this._visibleTiles.sizeY - (this._visibleTiles.marginSize * 2)))
        );
    }

    /**
     * @param {string} text
     * @param {Font} font
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

module.exports = Canvas;