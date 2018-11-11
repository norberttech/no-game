'use strict';

const Assert = require('assert-js');
const Character = require('./../Character');
const Size = require('./Size');
const MessageUI = require('./MessageUI');

class CharacterUI
{
    /**
     * @param {Character} character
     */
    constructor(character)
    {
        Assert.instanceOf(character, Character);

        this._character = character;
        this._incomeMessages = [];
    }

    /**
     * @returns {string}
     */
    get id()
    {
        return this._character.id;
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
     * @returns {AbsolutePosition}
     */
    get position()
    {
        return this._character.position;
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._character.name;
    }

    /**
     * @returns {int}
     */
    get health()
    {
        return this._character.health;
    }

    /**
     * @returns {int}
     */
    get maxHealth()
    {
        return this._character.maxHealth;
    }

    /**
     * @param {Size} tileSize
     * @return {Size}
     */
    calculateMoveAnimationOffset(tileSize)
    {
        if (!this._character.isMoving) {
            return new Size(0, 0);
        }

        let moveFrom = this._character.movingFromPosition;
        let currentPos = this._character.position;

        let offsetX = 0;
        let offsetY = 0;

        if (moveFrom.x + 1 === currentPos.x) {
            offsetX -= this._getProgress(tileSize.getWidth()) - tileSize.getWidth();
        }

        if (moveFrom.x - 1 === currentPos.x) {
            offsetX += this._getProgress(tileSize.getWidth()) - tileSize.getWidth();
        }

        if (moveFrom.y + 1 === currentPos.y) {
            offsetY -= this._getProgress(tileSize.getHeight()) - tileSize.getHeight();
        }

        if (moveFrom.y - 1 === currentPos.y) {
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
    get messages()
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

module.exports = CharacterUI;