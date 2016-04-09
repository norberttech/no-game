'use strict';

import Canvas from './Canvas';
import Mouse from './../UserInterface/Mouse';
import SpriteMap from './SpriteMap';
import Directions from './../Directions';
import Tile from './../Map/Tile';
import PlayerUI from './PlayerUI';
import CharactersUI from './CharactersUI';
import Character from './../Character';
import Assert from 'assert-js';
import Calculator from './../../Common/Area/Calculator';
import Position from './../Position';

export default class Engine
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
     * @param {Character[]} characters
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
     * @param {Tile[]} tiles
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
    }

    stopDrawing()
    {
        this._draw = false;
        this._canvas.clear();
    }

    draw()
    {
        if (this._draw) {
            if (this._spriteMap.isLoaded() && null !== this._visibleTiles) {
                if (null !== this._player && null !== this._tiles) {
                    this._canvas.clear();
                    this._drawVisibleArea();
                    this._drawVisibleCharacters();
                    this._drawPlayer();
                    this._drawMousePointer();
                }
            }

            this._animationLoop(this.draw.bind(this));
        }
    }

    /**
     * @returns {Position}
     */
    getMouseRelativePosition()
    {
        let x = this._mouse.getX();
        let y = this._mouse.getY();
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
        let centerSquarePosition = Calculator.centerPosition(this._visibleTiles.x, this._visibleTiles.y);

        return new Position(
            this._player.getX() - (centerSquarePosition.x - relPosition.getX()),
            this._player.getY() - (centerSquarePosition.y - relPosition.getY())
        );
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

        let animationOffset = this._player.calculateMoveAnimationOffset(this._canvas.calculateTileSize());

        for (let tileX = 0; tileX < this._visibleTiles.x; tileX++) {
            for (let tileY = 0; tileY < this._visibleTiles.y; tileY++) {
                let absoluteX = areaTiles.x + tileX;
                let absoluteY = areaTiles.y + tileY;
                let tile = this._tiles.get(`${absoluteX}:${absoluteY}`);

                if (tile === undefined) {
                    this._canvas.drawBlankTile(tileX, tileY, animationOffset);
                } else {
                    for (let spriteId of tile.stack()) {
                        let sprite = this._spriteMap.getSprite(spriteId);
                        this._canvas.drawTile(tileX, tileY, sprite, animationOffset);
                    }
                }
            }
        }
    }

    /**
     * @private
     */
    _drawVisibleCharacters()
    {
        let animationOffset = this._player.calculateMoveAnimationOffset(this._canvas.calculateTileSize());
        let visibleCharacters = this._characters.getVisibleCharacters(this._visibleTiles.x, this._visibleTiles.y);

        for (let character of visibleCharacters) {
            let relativeX = character.getRelativeX(this._visibleTiles.x, this._visibleTiles.y);
            let relativeY = character.getRelativeY(this._visibleTiles.x, this._visibleTiles.y);
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            let color = character.isPlayer ? '#44BBE3' : '#6B6B6B';

            this._canvas.drawCharacter(character.getName(), color, relativeX, relativeY, offset);

            if (this._player.isAttacking(character.getId())) {
                this._canvas.drawPointer(
                    "#FF0000",
                    relativeX,
                    relativeY,
                    offset
                );
            }

            this._canvas.drawHealthBar(
                character.health,
                character.maxHealth,
                relativeX,
                relativeY,
                offset
            );

            let messageIndex = 0;
            for (let message of character.getMessages()) {
                this._canvas.drawCharacterMessage(message.getText(), messageIndex, relativeX, relativeY, offset);
                messageIndex++;
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

        this._canvas.drawHealthBar(
            this._player.health,
            this._player.maxHealth,
            centerSquarePosition.x,
            centerSquarePosition.y
        );

        let messageIndex = 0;
        for (let message of this._player.getMessages()) {
            this._canvas.drawCharacterMessage(message.getText(), messageIndex, centerSquarePosition.x, centerSquarePosition.y);
            messageIndex++;
        }
    }

    /**
     * @private
     */
    _drawMousePointer()
    {
        let position = this.getMouseRelativePosition();
        let animationOffset = this._player.calculateMoveAnimationOffset(this._canvas.calculateTileSize());

        this._canvas.drawPointer(
            "#2979CF",
            position.getX(),
            position.getY(),
            animationOffset
        );
    }
}
