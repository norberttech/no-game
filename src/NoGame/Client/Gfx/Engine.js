'use strict';

import Canvas from './Canvas';
import MoveAnimation from './MoveAnimation';
import SpriteMap from './SpriteMap';
import Directions from './../Directions';
import Tile from './../Map/Tile';
import PlayerUI from './PlayerUI';
import Character from './../Character';
import Assert from './../../../JSAssert/Assert';
import Calculator from './../../Common/Area/Calculator';

export default class Engine
{
    /**
     * @param {Canvas} canvas
     * @param {function} animationLoop
     * @param {SpriteMap} spriteMap
     * @param debug
     */
    constructor(canvas, animationLoop, spriteMap, debug = false)
    {
        Assert.instanceOf(canvas, Canvas);
        Assert.isFunction(animationLoop);
        Assert.instanceOf(spriteMap, SpriteMap);
        Assert.boolean(debug);

        this._canvas = canvas;
        this._animationLoop = animationLoop;
        this._spriteMap = spriteMap;
        this._tiles = null;
        this._player = null;
        this._characters = [];
        this._charactersAnimations = new Map();
        this._visibleTiles = null;
        this._debug = debug;
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
        this._player = new PlayerUI(player);
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
                //this._drawVisibleCharacters();
                this._drawPlayer();
                //this._executeAnimations();

                if (this._debug === true) {
                    this._drawDebugInfo();
                }
            }
        }

        this._animationLoop(this.draw.bind(this));
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
            this._charactersAnimations.get(characterId).executeCallback();
            this._charactersAnimations.delete(characterId);
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
            x: this._player.getX() - ((this._visibleTiles.x - 1) / 2),
            y: this._player.getY() - ((this._visibleTiles.y - 1) / 2)
        };

        let pixelOffset = this._player.calculateMoveAnimationOffset(this._canvas.calculateTileSize());

        for (let tileX = 0; tileX <= this._visibleTiles.x; tileX++) {
            for (let tileY = 0; tileY <= this._visibleTiles.y; tileY++) {
                let absoluteX = areaTiles.x + tileX;
                let absoluteY = areaTiles.y + tileY;
                let tile = this._tiles.get(`${absoluteX}:${absoluteY}`);

                if (tile === undefined) {
                    this._canvas.drawBlankTile(tileX, tileY, pixelOffset);
                } else {
                    for (let spriteId of tile.stack()) {
                        let sprite = this._spriteMap.getSprite(spriteId);
                        this._canvas.drawTile(tileX, tileY, sprite, pixelOffset);
                    }
                }
            }
        }
    }

    _drawVisibleCharacters()
    {
        let centerSquarePosition = Calculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);
        let pixelOffset = this._calculateMovePixelOffset();

        for (let character of this._characters) {
            let relativeX = centerSquarePosition.x - (this._player.position().getX() - character.position().getX());
            let relativeY = centerSquarePosition.y - (this._player.position().getY() - character.position().getY());

            if (relativeX > 0 && relativeX < this._visibleTiles.x && relativeY > 0 && relativeY < this._visibleTiles.y) {
                let characterMoveOffset = this._calculateCharacterMovePixelOffset(character.id());

                this._canvas.drawCharacter(
                    character.name(),
                    relativeX,
                    relativeY,
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

        this._canvas.drawPlayer(
            this._player.getName(),
            centerSquarePosition.x,
            centerSquarePosition.y
        );
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
        this._charactersAnimations.forEach((characterAnimation, id, animations) => {
            if (characterAnimation.isFinished()) {
                characterAnimation.executeCallback();
                animations.delete(id);
            }
        });
    }

    _drawDebugInfo()
    {
        this._canvas.debugText(
            `Me {${this._player.getX()}:${this._player.getY()}}`,
            20,
            20
        );


        this._canvas.debugText(
            `Animation {${(this._playerMoveAnimation)
                ? this._playerMoveAnimation.calculatePixelOffset().x + ':' + this._playerMoveAnimation.calculatePixelOffset().y
                : 'not moving'}}`,
            20,
            40
        );


        //let charNumber = 0;
        //let playerPosition = this._player.position();
        //let centerSquarePosition = Calculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);
        //
        //for (let character of this._characters) {
        //    let absoluteX = centerSquarePosition.x - (playerPosition.getX() - character.position().getX());
        //    let absoluteY = centerSquarePosition.y - (playerPosition.getY() - character.position().getY());
        //
        //    this._canvas.debugText(
        //        `"${character.name()}" {${character.position().toString()}}, Abs{${absoluteX}, ${absoluteY}}`,
        //        20,
        //        140 + (charNumber * 40)
        //    );
        //
        //    this._canvas.debugText(
        //        `Animation {${(this._charactersAnimations.has(character.id()))
        //            ? this._charactersAnimations.get(character.id()).calculatePixelOffset().x + ':' + this._charactersAnimations.get(character.id()).calculatePixelOffset().y
        //            : 'not moving'}}
        //        `,
        //        20,
        //        160 + (charNumber * 40)
        //    );
        //    charNumber++;
        //}
    }
}
