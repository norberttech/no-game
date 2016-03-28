'use strict';

import Assert from 'assert-js';
import PlayerUI from './PlayerUI';
import Character from './../Character';
import Size from './Size';
import MessageUI from './MessageUI';
import Calculator from './../../Common/Area/Calculator';

export default class CharacterUI
{
    /**
     * @param {Character} character
     * @param {PlayerUI} player
     */
    constructor(character, player)
    {
        Assert.instanceOf(character, Character);
        Assert.instanceOf(player, PlayerUI);

        this._character = character;
        this._player = player;
        this._incomeMessages = [];
    }

    /**
     * @returns {string}
     */
    getId()
    {
        return this._character.id();
    }

    /**
     * @returns {boolean}
     */
    get isMonster()
    {
        return this._character.type === 2;
    }

    /**
     * @returns {boolean}
     */
    get isPlayer()
    {
        return this._character.type === 1;
    }

    /**
     * @param {int} visibleX
     * @param {int} visibleY
     * @returns {int}
     */
    getRelativeX(visibleX, visibleY)
    {
        let centerSquarePosition = Calculator.centerPosition(visibleX, visibleY);

        return centerSquarePosition.x - (this._player.getX() - this.getX());
    }

    /**
     * @param {int} visibleX
     * @param {int} visibleY
     * @returns {int}
     */
    getRelativeY(visibleX, visibleY)
    {
        let centerSquarePosition = Calculator.centerPosition(visibleX, visibleY);

        return centerSquarePosition.y - (this._player.getY() - this.getY());
    }

    /**
     * @returns {string}
     */
    getName()
    {
        return this._character.getName();
    }

    /**
     * @returns {int}
     */
    getX()
    {
        return this._character.getCurrentPosition().getX();
    }

    /**
     * @returns {int}
     */
    getY()
    {
        return this._character.getCurrentPosition().getY();
    }

    /**
     * @param {Size} tileSize
     * @return {Size}
     */
    calculateMoveAnimationOffset(tileSize)
    {
        if (!this._character.isMoving()) {
            return new Size(0, 0);
        }

        let moveFrom = this._character.getMovingFromPosition();
        let currentPos = this._character.getCurrentPosition();

        let offsetX = 0;
        let offsetY = 0;

        if (moveFrom.getX() + 1 === currentPos.getX()) {
            offsetX -= this._getProgress(tileSize.getWidth()) - tileSize.getWidth();
        }

        if (moveFrom.getX() - 1 === currentPos.getX()) {
            offsetX += this._getProgress(tileSize.getWidth()) - tileSize.getWidth();
        }

        if (moveFrom.getY() + 1 === currentPos.getY()) {
            offsetY -= this._getProgress(tileSize.getHeight()) - tileSize.getHeight();
        }

        if (moveFrom.getY() - 1 === currentPos.getY()) {
            offsetY += this._getProgress(tileSize.getHeight()) - tileSize.getHeight();
        }

        return new Size(-offsetX, -offsetY);
    }

    /**
     * @param {string} text
     */
    say(text)
    {
        if (text.length > 40) {
            for (let textPart of text.match(/.{1,40}/g)) {
                this._incomeMessages.unshift(new MessageUI(textPart));
            }
        } else {
            this._incomeMessages.unshift(new MessageUI(text));
        }

        if (this._incomeMessages.length > 6) {
            this._incomeMessages.pop();
        }
    }

    /**
     * @return {MessageUI[]}
     */
    getMessages()
    {
        let visibleMessages = [];

        for (let message of this._incomeMessages) {
            if (message.isVisible()) {
                visibleMessages.push(message);
            }
        }
        return visibleMessages;
    }

    /**
     * @param distance
     * @returns {int}
     * @private
     */
    _getProgress(distance)
    {
        let duration = this._character.getMoveTime();
        let progress = Math.min((duration - (this._character.getMoveEnds() - new Date().getTime())) / duration, 1);

        return Math.round(distance * progress);
    }
}