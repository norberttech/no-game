'use strict';

import Canvas from './Canvas';
import SpriteMap from './SpriteMap';
import Tile from './../Map/Tile';
import Player from './../Player';
import Character from './../Character';
import Calculator from './../../Common/Area/Calculator';
import Assert from './../../../JSAssert/Assert';

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
        this._tiles = null;
        this._player = null;
        this._characters = [];
        this._visibleTiles = null;
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    setVisibleTiles(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._canvas.setVisibleTiles(x, y);
        this._visibleTiles = {x: x, y: y};
    }

    loadSprites()
    {
        this._spriteMap.load();
    }

    /**
     * @param {Player} player
     */
    setPlayer(player)
    {
        Assert.instanceOf(player, Player);

        this._player = player;
    }

    /**
     * @param {Character[]} characters
     */
    setCharacters(characters)
    {
        Assert.containsOnly(characters, Character);

        this._characters = characters;
    }

    /**
     * @param {Tile[]} tiles
     */
    setTiles(tiles)
    {
        Assert.instanceOf(tiles, Map);

        this._tiles = tiles;
    }

    draw()
    {
        this._canvas.clear();
        if (this._spriteMap.isLoaded() && null !== this._visibleTiles) {
            if (null !== this._player && null !== this._tiles) {
                this._drawVisibleArea();
                this._drawVisibleCharacters();
                this._drawPlayer();
            }
        }

        this._animationFunction(this.draw.bind(this));
    }

    /**
     * @private
     */
    _drawVisibleArea()
    {
        let areaTiles = {
            x: this._player.position().x - ((this._visibleTiles.x - 1) / 2),
            y: this._player.position().y - ((this._visibleTiles.y - 1) / 2)
        };

        for (let x = 0; x < this._visibleTiles.x; x++) {
            for (let y = 0; y < this._visibleTiles.y; y++) {
                let tileX = areaTiles.x + x;
                let tileY = areaTiles.y + y;
                let tile = this._tiles.get(`${tileX}:${tileY}`);

                if (tile === undefined) {
                    this._canvas.drawBlankTile(x, y);
                } else {
                    for (let spriteId of tile.stack()) {
                        let sprite = this._spriteMap.getSprite(spriteId);
                        this._canvas.drawTile(x, y, sprite);
                    }
                }
            }
        }

        this._canvas.drawGrid();
    }

    _drawVisibleCharacters()
    {
        let range = Calculator.visibleTilesRange(
            this._player.position().x,
            this._player.position().y,
            this._visibleTiles.x,
            this._visibleTiles.y
        );

        let centerSquarePosition = Calculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);

        for (let character of this._characters) {
            if (character.position().x > range.x.start && character.position().x < range.x.end
                && character.position().y > range.y.start && character.position().y < range.y.end) {

                let absoluteX = centerSquarePosition.x - (this._player.position().x - character.position().x);
                let absoluteY = centerSquarePosition.y - (this._player.position().y - character.position().y);

                this._canvas.drawCharacter(character.name(), absoluteX, absoluteY);
            }
        }
    }

    /**
     * @private
     */
    _drawPlayer()
    {
        let centerSquarePosition = {
            x: (this._visibleTiles.x - 1) / 2,
            y: (this._visibleTiles.y - 1) / 2
        };

        this._canvas.drawPLayer(this._player.name(), centerSquarePosition.x, centerSquarePosition.y);
    }
}
