'use strict';

const Assert = require('assert-js');
const Player = require('./../Player');
const Size = require('./Size');
const MessageUI = require('./MessageUI');
const Directions = require('./../Directions');
const VisibleTiles = require('./../VisibleTiles');

class PlayerUI
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        Assert.instanceOf(player, Player);
        this._player = player;
        this._incomeMessages = [];
    }

    /**
     * @param {Size} tileSize
     * @return {Size}
     */
    calculateMoveAnimationOffset(tileSize)
    {
        if (!this._player.isMoving) {
            return new Size(0, 0);
        }

        let moveFrom = this._player.movingFromPosition;
        let currentPos = this._player.position;
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

        return new Size(offsetX, offsetY);
    }

    /**
     * @param {int} relativeX
     * @param {VisibleTiles} visibleTiles
     * @return {int}
     */
    toAbsoluteX(relativeX, visibleTiles)
    {
        return (this.absoluteX - ((visibleTiles.sizeX - visibleTiles.marginSize) / 2)) + relativeX;
    }

    /**
     * @param {int} relativeY
     * @param {VisibleTiles} visibleTiles
     * @return {int}
     */
    toAbsoluteY(relativeY, visibleTiles)
    {
        return (this.absoluteY - ((visibleTiles.sizeY - visibleTiles.marginSize) / 2)) + relativeY;
    }

    /**
     * @returns {int}
     */
    get experience()
    {
        return this._player.experience;
    }

    /**
     * @returns {int}
     */
    get level()
    {
        return this._player.level;
    }

    /**
     * @returns {int}
     */
    get absoluteX()
    {
        return this._player.position.x;
    }

    /**
     * @returns {int}
     */
    get absoluteY()
    {
        return this._player.position.y;
    }

    /**
     * @returns {int}
     */
    get health()
    {
        return this._player.health;
    }

    /**
     * @returns {int}
     */
    get maxHealth()
    {
        return this._player.maxHealth;
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._player.name;
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
     * @param {string} characterId
     * @returns {boolean}
     */
    isAttacking(characterId)
    {
        if (!this._player.isAttacking) {
            return false;
        }

        return this._player.targetId === characterId;
    }

    /**
     * @param {string} characterId
     * @returns {boolean}
     */
    isAttackedBy(characterId)
    {
        return this._player.isAttackedBy(characterId);
    }

    /**
     * @param {int} distance
     * @returns {int}
     * @private
     */
    _getProgress(distance)
    {
        let duration = this._player.getMoveTime();
        let progress = Math.min((duration - (this._player.getMoveEnds() - new Date().getTime())) / duration, 1);

        return Math.round(distance * progress);
    }

    get outfitSpriteId()
    {
        switch (this._player.direction) {
            case Directions.DOWN:
                return 807;
            case Directions.LEFT:
                return 810;
            case Directions.RIGHT:
                return 804;
            case Directions.UP:
                return 801;
        }
    }
}

module.exports = PlayerUI;