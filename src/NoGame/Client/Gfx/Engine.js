'use strict';

import Canvas from './Canvas';
import MoveAnimation from './MoveAnimation';
import SpriteMap from './SpriteMap';
import Directions from './../Directions';
import Tile from './../Map/Tile';
import Player from './../Player';
import Character from './../Character';
import Assert from './../../../JSAssert/Assert';
import Calculator from './../../Common/Area/Calculator';

export default class Engine
{
    /**
     * @param {Canvas} canvas
     * @param {function} animationLoop
     * @param {SpriteMap} spriteMap
     */
    constructor(canvas, animationLoop, spriteMap)
    {
        Assert.instanceOf(canvas, Canvas);
        Assert.isFunction(animationLoop);
        Assert.instanceOf(spriteMap, SpriteMap);

        this._canvas = canvas;
        this._animationLoop = animationLoop;
        this._spriteMap = spriteMap;
        this._tiles = null;
        this._player = null;
        this._characters = [];
        this._charactersAnimations = new Map();
        this._visibleTiles = null;
        this._playerMoveAnimation = null;
        this._onDraw = null;
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    setVisibleTiles(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._canvas.setVisibleTiles(x, y, 1);
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

    /**
     * @param {function} callback
     */
    onDraw(callback)
    {
        Assert.isFunction(callback);

        this._onDraw = callback;
    }

    draw()
    {
        if (this._onDraw !== null) {
            this._onDraw();
        }

        this._canvas.clear();
        if (this._spriteMap.isLoaded() && null !== this._visibleTiles) {
            if (null !== this._player && null !== this._tiles) {
                this._drawVisibleArea();
                this._drawVisibleCharacters();
                this._drawPlayer();
                this._executeAnimations();
            }
        }

        this._animationLoop(this.draw.bind(this));
    }

    /**
     * @param moveTime
     * @param {function} finishCallback
     * @param {int} moveDirection
     */
    move(moveTime, finishCallback, moveDirection)
    {
        if (null !== this._playerMoveAnimation) {
            return ;
        }

        let distancePx = (moveDirection === Directions.LEFT || moveDirection === Directions.RIGHT)
            ? this._canvas.calculateTileSize().getWidth()
            : this._canvas.calculateTileSize().getHeight();

        this._playerMoveAnimation = new MoveAnimation(
            moveTime,
            distancePx,
            finishCallback,
            moveDirection
        );
    }

    /**
     * @param {string} characterId
     * @param {int} moveTime
     * @param {function} finishCallback
     * @param {int} moveDirection
     */
    characterMove(characterId, moveTime, finishCallback, moveDirection)
    {
        if (this._charactersAnimations.has(characterId)) {
            return ;
        }

        let distancePx = (moveDirection === Directions.LEFT || moveDirection === Directions.RIGHT)
            ? this._canvas.calculateTileSize().getWidth()
            : this._canvas.calculateTileSize().getHeight();


        this._charactersAnimations.set(characterId, new MoveAnimation(
            moveTime,
            distancePx,
            finishCallback,
            moveDirection
        ));
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
        let pixelOffset = this._calculateMovePixelOffset();

        for (let tileX = 0; tileX < this._visibleTiles.x; tileX++) {
            for (let tileY = 0; tileY < this._visibleTiles.y; tileY++) {
                let absoluteX = areaTiles.x + tileX;
                let absoluteY = areaTiles.y + tileY;
                let tile = this._tiles.get(`${absoluteX}:${absoluteY}`);

                if (tile === undefined) {
                    this._canvas.drawBlankTile(tileX, tileY, pixelOffset.x, pixelOffset.y);
                } else {
                    for (let spriteId of tile.stack()) {
                        let sprite = this._spriteMap.getSprite(spriteId);
                        this._canvas.drawTile(tileX, tileY, sprite, pixelOffset.x, pixelOffset.y);
                    }
                }
            }
        }
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
        let pixelOffset = this._calculateMovePixelOffset();

        for (let character of this._characters) {
            if (character.position().x >= range.x.start && character.position().x <= range.x.end
                && character.position().y >= range.y.start && character.position().y <= range.y.end) {

                let absoluteX = centerSquarePosition.x - (playerPosition.x - character.position().x);
                let absoluteY = centerSquarePosition.y - (playerPosition.y - character.position().y);
                let characterMoveOffset = this._calculateCharacterMovePixelOffset(character.id());

                this._canvas.drawCharacter(
                    character.name(),
                    absoluteX,
                    absoluteY,
                    pixelOffset.x + characterMoveOffset.x,
                    pixelOffset.y + characterMoveOffset.y
                );
            }
        }
    }

    /**
     * @private
     */
    _drawPlayer()
    {
        let centerSquarePosition = Calculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);

        this._canvas.drawPLayer(
            this._player.name(),
            centerSquarePosition.x,
            centerSquarePosition.y
        );
    }

    /**
     * @returns {{x: number, y: number}}
     * @private
     */
    _calculateMovePixelOffset()
    {
        if (this._playerMoveAnimation !== null) {
            return this._playerMoveAnimation.calculatePixelOffset();
        }

        return {x: 0, y: 0};
    }

    /**
     * @returns {{x: number, y: number}}
     * @private
     */
    _calculateCharacterMovePixelOffset(id)
    {
        if (this._charactersAnimations.has(id)) {
            let offset = this._charactersAnimations.get(id).calculatePixelOffset();

            return {x: -offset.x, y: -offset.y};
        }

        return {x: 0, y: 0};
    }

    /**
     * @private
     */
    _executeAnimations()
    {
        if (this._playerMoveAnimation !== null) {
            if (!this._playerMoveAnimation.isFinished()) {
                this._playerMoveAnimation.executeCallback();
                this._playerMoveAnimation = null;
            }
        }

        this._charactersAnimations.forEach((characterAnimation, id, animations) => {
            if (!characterAnimation.isFinished()) {
                characterAnimation.executeCallback();
                animations.delete(id);
            }
        });
    }
}
