'use strict';

import Assert from './../../../JSAssert/Assert';
import Canvas from './Canvas';
import SpriteMap from './SpriteMap';
import Tile from './../Map/Tile';
import Player from './../Player'

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
        this._visibleTiles = {x: 15, y: 11};
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
        if (this._spriteMap.isLoaded()) {
            if (null !== this._player && null !== this._tiles) {
                this._drawVisibleArea();
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

                for (let spriteId of tile.stack()) {
                    let sprite = this._spriteMap.getSprite(spriteId);
                    this._canvas.drawTile(x, y, sprite, this._visibleTiles.x, this._visibleTiles.y);
                }
            }
        }

        this._canvas.drawGrid(this._visibleTiles.x, this._visibleTiles.y);
    }

    /**
     * @private
     */
    _drawPlayer()
    {
        let areaPosition = {
            x: (this._visibleTiles.x - 1) / 2,
            y: (this._visibleTiles.y - 1) / 2
        };

        this._canvas.drawPLayer(this._player.name(), areaPosition.x, areaPosition.y, this._visibleTiles.x, this._visibleTiles.y);
    }
}
