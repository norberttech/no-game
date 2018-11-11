'use strict';

const Assert = require('assert-js');
const AreaCalculator = require('./../../Common/AreaCalculator');
const Canvas = require('./Canvas');
const Size = require('./Size');
const Font = require('./Font');
const PlayerUI = require('./PlayerUI');
const CharactersUI = require('./CharactersUI');
const SpriteMap = require('./SpriteMap');
const Mouse = require('./../Input/Mouse');
const Character = require('./../Character');
const Position = require('./../Position');
const Colors = require('./Colors');
const TileAnimations = require('./Engine/TileAnimations');
const TilePosition = require('./Engine/TilePosition');
const FrameAnimation = require('./Animation/FrameAnimation');
const MoveAnimation = require('./Animation/MoveAnimation');
const DrawingTimer = require('./Engine/DrawingTimer');

class Engine
{
    /**
     * @param {Canvas} canvas
     * @param {function} animationLoop
     * @param {SpriteMap} spriteMap
     * @param {Mouse} mouse
     */
    constructor(canvas, animationLoop, spriteMap, mouse)
    {
        Assert.instanceOf(canvas, Canvas);
        Assert.isFunction(animationLoop);
        Assert.instanceOf(spriteMap, SpriteMap);
        Assert.instanceOf(mouse, Mouse);

        this._canvas = canvas;
        this._animationLoop = animationLoop;
        this._spriteMap = spriteMap;
        this._mouse = mouse;
        this._tiles = null;
        this._player = null;
        this._characters = new CharactersUI();
        this._visibleTiles = null;
        this._hiddenTiles = 1;
        this._draw = false;
        this._drawingTimer = new DrawingTimer(30);
        this._tileAnimations = new TileAnimations();
    }

    /**
     * @returns {TileAnimations}
     */
    get tileAnimations()
    {
        return this._tileAnimations;
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    setVisibleTiles(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        this._canvas.setVisibleTiles(x, y, this._hiddenTiles);
        this._visibleTiles = {x: x, y: y};
    }

    /**
     * @returns {{x: int, y: int}}
     */
    getVisibleTiles()
    {
        return this._visibleTiles;
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
     * @param {array<Character>} characters
     */
    setCharacters(characters)
    {
        Assert.containsOnly(characters, Character);

        this._characters.updateCharacters(characters, this._player);
    }

    /**
     * @param {string} message
     */
    playerSay(message)
    {
        this._player.say(message);
    }

    /**
     * @param {string} characterId
     * @param {string} text
     */
    characterSay(characterId, text)
    {
        this._characters.say(characterId, text);
    }

    /**
     * @param {Map} tiles
     */
    setTiles(tiles)
    {
        Assert.instanceOf(tiles, Map);

        this._tiles = tiles;
    }

    startDrawing()
    {
        this._draw = true;
        this.draw();
        this._drawingTimer.start();
    }

    stopDrawing()
    {
        this._draw = false;
        this._tileAnimations.clear();
        this._characters.clear();
        this._canvas.clear();
        this._drawingTimer.stop();
    }

    draw()
    {
        if (this._draw) {
            this._drawingTimer.draw(() => {
                if (this._spriteMap.isLoaded() && null !== this._visibleTiles) {

                    let centerSquarePosition = AreaCalculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);
                    let animationOffset = this._player.calculateMoveAnimationOffset(this._canvas.calculateTileSize());

                    if (null !== this._player && null !== this._tiles) {
                        this._canvas.clear();
                        this._drawGround(animationOffset);
                        this._drawTileStack(animationOffset, centerSquarePosition);
                        this._drawNames(animationOffset, centerSquarePosition);
                        this._drawFPS();
                        this._drawStatistics();
                        this._drawMessages(animationOffset);
                        this._drawMousePointer(animationOffset);
                        this._drawTileAnimations(animationOffset);
                    }
                }
            });

            this._animationLoop(this.draw.bind(this));
        }
    }

    /**
     * @returns {Position}
     */
    getMouseRelativePosition()
    {
        let x = this._mouse.x;
        let y = this._mouse.y;
        let tileSize = this._canvas.calculateTileSize();

        return new Position(
            Math.floor(x / tileSize.getWidth()) + this._hiddenTiles,
            Math.floor(y / tileSize.getHeight()) + this._hiddenTiles
        );
    }

    /**
     * @returns {Position}
     */
    getMouseAbsolutePosition()
    {
        let relPosition = this.getMouseRelativePosition();
        let centerSquarePosition = AreaCalculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);

        return new Position(
            this._player.x - (centerSquarePosition.x - relPosition.x),
            this._player.y - (centerSquarePosition.y - relPosition.y)
        );
    }

    /**
     * @returns {Size}
     * @private
     */
    get _characterOffset()
    {
        let tileSize = this._canvas.calculateTileSize();

        return new Size(- Math.round(tileSize.width * 0.25), - Math.round(tileSize.height * 0.25))
    }

    /**
     * @returns {{x: int, y: int}}
     */
    get _areaTiles()
    {
        return {
            x: this._player.x - ((this._visibleTiles.x - 1) / 2),
            y: this._player.y - ((this._visibleTiles.y - 1) / 2)
        };
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawGround(animationOffset)
    {
        let areaTiles = this._areaTiles;

        for (let relativeTileX = 0; relativeTileX < this._visibleTiles.x; relativeTileX++) {
            for (let relativeTileY = 0; relativeTileY < this._visibleTiles.y; relativeTileY++) {
                let absoluteX = areaTiles.x + relativeTileX;
                let absoluteY = areaTiles.y + relativeTileY;
                let tile = this._tiles.get(`${absoluteX}:${absoluteY}`);

                if (tile === undefined) {
                    this._canvas.drawBlankTile(relativeTileX, relativeTileY, animationOffset);
                } else {
                    this._canvas.drawSprite(relativeTileX, relativeTileY, this._spriteMap.getSprite(tile.ground), animationOffset);
                }
            }
        }
    }

    /**
     * @param {Size} animationOffset
     * @param {{x: int, y: int}} centerSquarePosition
     * @private
     */

    _drawTileStack(animationOffset, centerSquarePosition)
    {
        let areaTiles = this._areaTiles;

        for (let relativeTileX = 0; relativeTileX < this._visibleTiles.x; relativeTileX++) {
            for (let relativeTileY = 0; relativeTileY < this._visibleTiles.y; relativeTileY++) {
                let absoluteTileX = areaTiles.x + relativeTileX;
                let absoluteTileY = areaTiles.y + relativeTileY;

                this._drawCharacter(
                    relativeTileX,
                    relativeTileY,
                    absoluteTileX,
                    absoluteTileY,
                    animationOffset
                );

                this._drawPlayer(
                    relativeTileX,
                    relativeTileY,
                    absoluteTileX,
                    absoluteTileY,
                    centerSquarePosition,
                    animationOffset
                );

                this._drawTile(absoluteTileX, absoluteTileY, relativeTileX, relativeTileY, animationOffset);
            }
        }
    }

    /**
     * @param {int} relativeTileX
     * @param {int} relativeTileY
     * @param {int} absoluteX
     * @param {int} absoluteY
     * @param {{x: int, y: int}} centerSquarePosition
     * @param {Size} animationOffset
     * @private
     */
    _drawPlayer(relativeTileX, relativeTileY, absoluteX, absoluteY, centerSquarePosition, animationOffset)
    {
        if (relativeTileX === centerSquarePosition.x && relativeTileY === centerSquarePosition.y) {
            this._canvas.drawSprite(
                centerSquarePosition.x,
                centerSquarePosition.y,
                this._spriteMap.getSprite(this._player.outfitSpriteId),
                this._characterOffset
            );
        }

    }

    /**
     * @param {int} relativeTileX
     * @param {int} relativeTileY
     * @param {int} absoluteTileX
     * @param {int} absoluteTileY
     * @param {Size} animationOffset
     * @private
     */
    _drawCharacter(relativeTileX, relativeTileY, absoluteTileX, absoluteTileY, animationOffset)
    {
        let character = this._characters.character(absoluteTileX, absoluteTileY);

        if (character !== undefined) {
            let color = character.isPlayer ? Colors.BLUE : Colors.GRAY;
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            this._canvas.drawCharacter(
                color,
                relativeTileX,
                relativeTileY,
                offset.add(this._characterOffset)
            );
        }
    }

    /**
     * @param {int} absoluteTileX
     * @param {int} absoluteTileY
     * @param {int} relativeTileX
     * @param {int} relativeTileY
     * @param {Size} animationOffset
     * @private
     */
    _drawTile(absoluteTileX, absoluteTileY, relativeTileX, relativeTileY, animationOffset)
    {
        let tile = this._tiles.get(`${absoluteTileX}:${absoluteTileY}`);

        if (tile !== undefined && tile.stack.length) {
            for (let spriteId of tile.stack) {
                if (this._spriteMap.hasSprite(spriteId)) {
                    let sprite = this._spriteMap.getSprite(spriteId);
                    this._canvas.drawSprite(relativeTileX, relativeTileY, sprite, animationOffset);
                }
            }
        }
    }

    /**
     * @param {Size} animationOffset
     * @param {{x: int, y: int}} centerSquarePosition
     * @private
     */
    _drawNames(animationOffset, centerSquarePosition)
    {
        let visibleCharacters = this._characters.getVisibleCharacters(this._visibleTiles.x, this._visibleTiles.y);
        let font = new Font('Verdana', 'normal', 15);

        for (let character of visibleCharacters) {
            let relativeX = character.getRelativeX(this._visibleTiles.x, this._visibleTiles.y);
            let relativeY = character.getRelativeY(this._visibleTiles.x, this._visibleTiles.y);
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            this._canvas.drawCharacterName(
                character.name,
                relativeX,
                relativeY,
                offset.add(this._characterOffset),
                font
            );
            this._canvas.drawHealthBar(
                character.health,
                character.maxHealth,
                relativeX,
                relativeY,
                offset.add(this._characterOffset)
            );
        }

        this._canvas.drawCharacterName(
            this._player.name,
            centerSquarePosition.x,
            centerSquarePosition.y,
            this._characterOffset,
            font
        );

        this._canvas.drawHealthBar(
            this._player.health,
            this._player.maxHealth,
            centerSquarePosition.x,
            centerSquarePosition.y,
            this._characterOffset
        );
    }

    _drawFPS()
    {
        let font = new Font('Verdana', 'normal', 15, Colors.YELLOW);

        this._canvas.text(
            `${this._drawingTimer.fps} FPS`,
            font,
            500,
            10
        );
    }

    _drawStatistics()
    {
        let font = new Font('Verdana', 'normal', 15, Colors.YELLOW);

        this._canvas.text(
            `Experience: ${this._player.experience}`,
            font,
            10,
            10
        );

        this._canvas.text(
            `Level: ${this._player.level}`,
            font,
            10,
            35
        );
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawTileAnimations(animationOffset)
    {
        let areaTiles = this._areaTiles;

        for (let relativeTileX = 0; relativeTileX < this._visibleTiles.x; relativeTileX++) {
            for (let relativeTileY = 0; relativeTileY < this._visibleTiles.y; relativeTileY++) {
                let absoluteX = areaTiles.x + relativeTileX;
                let absoluteY = areaTiles.y + relativeTileY;

                if (this._tileAnimations.has(absoluteX, absoluteY)) {
                    let animationStack = this._tileAnimations.get(absoluteX, absoluteY);

                    for (let animation of animationStack.all) {

                        if (animation instanceof FrameAnimation) {
                            let sprite = this._spriteMap.getSprite(animation.frame);
                            this._canvas.drawSprite(relativeTileX, relativeTileY, sprite, animationOffset);
                        }

                        if (animation instanceof MoveAnimation) {
                            this._canvas.textTile(
                                animation.text,
                                animation.font,
                                relativeTileX,
                                relativeTileY,
                                animationOffset,
                                new Size(-10, -animation.distance),
                                TilePosition.TOP_RIGHT
                            );
                        }
                    }
                }
            }
        }
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawMessages(animationOffset)
    {
        let visibleCharacters = this._characters.getVisibleCharacters(this._visibleTiles.x, this._visibleTiles.y);
        let font = new Font('Verdana', 'normal', 15, Colors.YELLOW);

        for (let character of visibleCharacters) {
            let relativeX = character.getRelativeX(this._visibleTiles.x, this._visibleTiles.y);
            let relativeY = character.getRelativeY(this._visibleTiles.x, this._visibleTiles.y);
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            let messageIndex = 0;
            for (let message of character.messages) {
                this._canvas.drawCharacterMessage(message.getText(), messageIndex, relativeX, relativeY, offset, font);
                messageIndex++;
            }
        }

        let centerSquarePosition = AreaCalculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);
        let playerMessageIndex = 0;
        for (let message of this._player.messages) {
            this._canvas.drawCharacterMessage(
                message.getText(),
                playerMessageIndex,
                centerSquarePosition.x,
                centerSquarePosition.y,
                new Size(0,0 ),
                font
            );
            playerMessageIndex++;
        }
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawMousePointer(animationOffset)
    {
        let position = this.getMouseRelativePosition();

        let visibleCharacters = this._characters.getVisibleCharacters(this._visibleTiles.x, this._visibleTiles.y);

        for (let character of visibleCharacters) {
            let relativeX = character.getRelativeX(this._visibleTiles.x, this._visibleTiles.y);
            let relativeY = character.getRelativeY(this._visibleTiles.x, this._visibleTiles.y);
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            if (this._player.isAttacking(character.id)) {
                this._canvas.drawPointer(
                    Colors.RED,
                    relativeX,
                    relativeY,
                    offset
                );
            }
        }

        this._canvas.drawPointer(
            Colors.BLUE,
            position.x,
            position.y,
            animationOffset
        );
    }
}

module.exports = Engine;