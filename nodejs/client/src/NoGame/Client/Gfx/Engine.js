'use strict';

const Assert = require('assert-js');
const Area = require('./../Map/Area');
const Canvas = require('./Canvas');
const Size = require('./Size');
const Font = require('./Font');
const PlayerUI = require('./PlayerUI');
const CharactersUI = require('./CharactersUI');
const SpriteMap = require('./SpriteMap');
const Mouse = require('./../Input/Mouse');
const Character = require('./../Character');
const Directions = require('./../Directions');
const AbsolutePosition = require('./../Tile/AbsolutePosition');
const Colors = require('./Colors');
const TileAnimations = require('./Engine/TileAnimations');
const TilePosition = require('./Engine/TilePosition');
const FrameAnimation = require('./Animation/FrameAnimation');
const MoveAnimation = require('./Animation/MoveAnimation');
const DrawingTimer = require('./Engine/DrawingTimer');
const VisibleTiles = require('./../VisibleTiles');
const RelativePosition = require('./../Tile/RelativePosition');

const VISIBLE_TILES_MARGIN_SIZE = 1;

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
        this._area = null;
        this._player = null;
        this._playerUI = null;
        this._characters = new CharactersUI();
        this._visibleTiles = null;
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
     * @param {int} sizeX
     * @param {int} sizeY
     */
    setVisibleTiles(sizeX, sizeY)
    {
        Assert.integer(sizeX);
        Assert.integer(sizeY);

        this._visibleTiles = new VisibleTiles(sizeX, sizeY, VISIBLE_TILES_MARGIN_SIZE);
        this._canvas.setVisibleTiles(this._visibleTiles);
    }

    /**
     * @returns {VisibleTiles}
     */
    get visibleTiles()
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
        this._player = player;
        this._playerUI = new PlayerUI(player);
    }

    /**
     * @param {array<Character>} characters
     */
    setCharacters(characters)
    {
        Assert.containsOnly(characters, Character);

        this._characters.updateCharacters(characters);
    }

    /**
     * @param {string} message
     */
    playerSay(message)
    {
        this._playerUI.say(message);
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
     * @param {Map} area
     */
    setArea(area)
    {
        Assert.instanceOf(area, Area);

        this._area = area;
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

                    let animationOffset = this._playerUI.calculateMoveAnimationOffset(this._canvas.calculateTileSize());

                    if (null !== this._playerUI && null !== this._area) {
                        this._canvas.clear();
                        this._drawGround(animationOffset);
                        this._drawLayers(animationOffset);
                        this._drawNames(animationOffset);
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
     * @returns {RelativePosition}
     */
    get mouseRelativePosition()
    {
        try {
            let tileSize = this._canvas.calculateTileSize();

            return new RelativePosition(
                Math.floor(this._mouse.pixelPositionX / tileSize.getWidth()) + this._visibleTiles.marginSize,
                Math.floor(this._mouse.pixelPositionY / tileSize.getHeight()) + this._visibleTiles.marginSize,
                this._visibleTiles
            );
        } catch (e) {
            return RelativePosition.createCenter(this.visibleTiles);
        }
    }

    /**
     * @returns {AbsolutePosition}
     */
    get mouseAbsolutePosition()
    {
        return this.mouseRelativePosition.toAbsolute(this._player);
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
     * @param {Size} animationOffset
     * @private
     */
    _drawGround(animationOffset)
    {
        this.visibleTiles.each((relativeTilePosition) => {
            let tile = this._area.tile(
                relativeTilePosition.toAbsolute(this._player)
            );

            if (tile === undefined) {
                this._canvas.drawBlankTile(relativeTilePosition, animationOffset);
            } else {
                this._canvas.drawSprite(relativeTilePosition, this._spriteMap.getSprite(tile.ground), animationOffset);
            }
        });
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawLayers(animationOffset)
    {
        this.visibleTiles.each((relativeTilePosition) => {
            let tile = this._area.tile(relativeTilePosition.toAbsolute(this._player));

            this._drawSprite(tile.layer1, relativeTilePosition, animationOffset);
        });

        this.visibleTiles.each((relativeTilePosition) => {
            let tile = this._area.tile(relativeTilePosition.toAbsolute(this._player));

            this._drawSprite(tile.layer2, relativeTilePosition, animationOffset);
        });

        this.visibleTiles.each((relativeTilePosition) => {
            this._drawCharacter(
                relativeTilePosition,
                animationOffset
            );

            if (relativeTilePosition.isCenter) {
                this._drawPlayer(
                    relativeTilePosition,
                    animationOffset
                );
            }

            let tile = this._area.tile(relativeTilePosition.toAbsolute(this._player));

            this._drawSprite(tile.layer3, relativeTilePosition, animationOffset);
        });

        this.visibleTiles.each((relativeTilePosition) => {
            let tile = this._area.tile(relativeTilePosition.toAbsolute(this._player));

            this._drawSprite(tile.layer4, relativeTilePosition, animationOffset);
        });



//            this._drawSprite(relativeTilePosition, animationOffset);

            // TODO: make this optional, rendered only on demand and only in test mode.
//            this._canvas.textTile(
//                relativeTilePosition.toString(),
//                new Font('Verdana', 'normal', 10, Colors.YELLOW),
//                relativeTilePosition,
//                animationOffset,
//                new Size(0, 20),
//                TilePosition.TOP_LEFT
//            );
//            this._canvas.textTile(
//                relativeTilePosition.toAbsolute(this._player).toString(),
//                new Font('Verdana', 'normal', 10, Colors.YELLOW),
//                relativeTilePosition,
//                animationOffset,
//                new Size(0, 40),
//                TilePosition.TOP_LEFT
//            );
//        });
    }

    /**
     * @param {RelativePosition} relativeTilePosition
     * @param {Size} animationOffset
     * @private
     */
    _drawPlayer(relativeTilePosition, animationOffset)
    {
        this._canvas.drawSprite(
            relativeTilePosition,
            this._spriteMap.getSprite(this._playerUI.outfitSpriteId),
            this._characterOffset
        );

        // prevent overdrawing player with layer 3 at position x:0,y+1 element when moving right
        if (this._player.isMoving && this._player.direction === Directions.RIGHT) {
            let tile = this._area.tile(relativeTilePosition.jumpBy(-1, 0).toAbsolute(this._player));
            this._drawSprite(tile.layer3, relativeTilePosition.jumpBy(-1, 0), animationOffset);
        }
    }

    /**
     * @param {RelativePosition} relativeTilePosition
     * @param {Size} animationOffset
     * @private
     */
    _drawCharacter(relativeTilePosition, animationOffset)
    {
        let character = this._characters.findCharacter(relativeTilePosition.toAbsolute(this._player));

        if (character !== null) {
            let color = character.isPlayer ? Colors.BLUE : Colors.RED;
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            this._canvas.drawCharacter(
                color,
                relativeTilePosition,
                offset.add(this._characterOffset)
            );
        }
    }

    /**
     * @param {int} spriteId
     * @param {RelativePosition} relativeTilePosition
     * @param {Size} animationOffset
     * @private
     */
    _drawSprite(spriteId, relativeTilePosition, animationOffset)
    {
        if (this._spriteMap.hasSprite(spriteId)) {
            let sprite = this._spriteMap.getSprite(spriteId);
            this._canvas.drawSprite(relativeTilePosition, sprite, animationOffset);
        }
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawNames(animationOffset)
    {
        let font = new Font('Verdana', 'normal', 15);

        this._visibleTiles.each((relativeTilePosition) => {
            let character = this._characters.findCharacter(relativeTilePosition.toAbsolute(this._player));

            if (character !== null) {
                let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

                this._canvas.drawCharacterName(
                    character.name,
                    relativeTilePosition,
                    offset.add(this._characterOffset),
                    font
                );
                this._canvas.drawHealthBar(
                    character.health,
                    character.maxHealth,
                    relativeTilePosition,
                    offset.add(this._characterOffset)
                );
            }
        });

        this._canvas.drawCharacterName(
            this._playerUI.name,
            this._visibleTiles.centerPosition,
            this._characterOffset,
            font
        );

        this._canvas.drawHealthBar(
            this._playerUI.health,
            this._playerUI.maxHealth,
            this._visibleTiles.centerPosition,
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
            `Experience: ${this._playerUI.experience}`,
            font,
            10,
            10
        );

        this._canvas.text(
            `Level: ${this._playerUI.level}`,
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
        this.visibleTiles.each((relativeTilePosition) => {
            let absolutePosition = relativeTilePosition.toAbsolute(this._player);

            if (this._tileAnimations.has(absolutePosition)) {
                let animationStack = this._tileAnimations.get(absolutePosition);

                for (let animation of animationStack.all) {

                    if (animation instanceof FrameAnimation) {
                        let sprite = this._spriteMap.getSprite(animation.frame);
                        this._canvas.drawSprite(relativeTilePosition, sprite, animationOffset);
                    }

                    if (animation instanceof MoveAnimation) {
                        this._canvas.textTile(
                            animation.text,
                            animation.font,
                            relativeTilePosition,
                            animationOffset,
                            new Size(-10, -animation.distance),
                            TilePosition.TOP_RIGHT
                        );
                    }
                }
            }
        });
    }

    /**
     * @param {Size} animationOffset
     * @private
     */
    _drawMessages(animationOffset)
    {
        let font = new Font('Verdana', 'normal', 15, Colors.YELLOW);

        this._visibleTiles.each((relativeTilePosition) => {
            let character = this._characters.findCharacter(relativeTilePosition.toAbsolute(this._player));

            if (character !== null) {
                let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

                let messageIndex = 0;
                for (let message of character.messages) {
                    this._canvas.drawCharacterMessage(
                        message.getText(),
                        messageIndex,
                        relativeTilePosition,
                        offset,
                        font
                    );
                    messageIndex++;
                }
            }
        });

        let playerMessageIndex = 0;
        for (let message of this._playerUI.messages) {
            this._canvas.drawCharacterMessage(
                message.getText(),
                playerMessageIndex,
                this._visibleTiles.centerPosition,
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
        this._visibleTiles.each((relativeTilePosition) => {
            let character = this._characters.findCharacter(relativeTilePosition.toAbsolute(this._player));

            if (character !== null) {
                let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

                if (this._playerUI.isAttacking(character.id)) {
                    this._canvas.drawPointer(
                        Colors.RED,
                        relativeTilePosition,
                        offset
                    );
                }
            }
        });


        this._canvas.drawPointer(
            Colors.BLUE,
            this.mouseRelativePosition,
            animationOffset
        );
    }
}

module.exports = Engine;