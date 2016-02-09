'use strict';

import Assert from './../../../JSAssert/Assert';
import Canvas from './Canvas';
import SpriteMap from './SpriteMap';
import Tile from './../Map/Tile';

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
        this._tiles = [];
    }

    loadSprites()
    {
        this._spriteMap.load();
    }

    /**
     * @param {Tile[]} tiles
     */
    setTiles(tiles)
    {
        Assert.containsOnly(tiles, Tile);
        this._tiles = tiles;
    }

    draw()
    {
        if (this._spriteMap.isLoaded()) {
            this._canvas.clear();
            for (let tile of this._tiles) {

                for (let spriteId of tile.stack()) {
                    let sprite = this._spriteMap.getSprite(spriteId);
                    this._canvas.drawTile(tile.x(), tile.y(), sprite, 10, 10);
                }
            }

            this._canvas.drawGrid(10, 10);
        }

        this._animationFunction(this.draw.bind(this));
    }
}
