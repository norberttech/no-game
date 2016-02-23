'use strict';

import Canvas from './Canvas';
import SpriteMap from './SpriteMap';
import Directions from './../Directions';
import Tile from './../Map/Tile';
import PlayerUI from './PlayerUI';
import CharactersUI from './CharactersUI';
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
        this._characters = new CharactersUI();
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

    draw()
    {
        this._canvas.clear();
        if (this._spriteMap.isLoaded() && null !== this._visibleTiles) {
            if (null !== this._player && null !== this._tiles) {
                this._drawVisibleArea();
                this._drawVisibleCharacters();
                this._drawPlayer();

                if (this._debug === true) {
                    this._drawDebugInfo();
                }
            }
        }

        this._animationLoop(this.draw.bind(this));
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

    _drawVisibleCharacters()
    {
        let animationOffset = this._player.calculateMoveAnimationOffset(this._canvas.calculateTileSize());
        let visibleCharacters = this._characters.getVisibleCharacters(this._visibleTiles.x, this._visibleTiles.y);

        for (let character of visibleCharacters) {
            let relativeX = character.getRelativeX(this._visibleTiles.x, this._visibleTiles.y);
            let relativeY = character.getRelativeY(this._visibleTiles.x, this._visibleTiles.y);
            let offset = animationOffset.add(character.calculateMoveAnimationOffset(this._canvas.calculateTileSize()));

            this._canvas.drawCharacter(character.getName(), relativeX, relativeY, offset);

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

        let messageIndex = 0;
        for (let message of this._player.getMessages()) {
            this._canvas.drawCharacterMessage(message.getText(), messageIndex, centerSquarePosition.x, centerSquarePosition.y);
            messageIndex++;
        }
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
    }
}
