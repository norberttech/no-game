'use strict';

import Assert from './../../../JSAssert/Assert';
import Player from './../Player';
import Size from './Size';
import MessageUI from './MessageUI';

export default class PlayerUI
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        Assert.instanceOf(player, Player);
        this._player = player;
        this._messages = [];
    }

    /**
     * @param {Size} tileSize
     * @return {Size}
     */
    calculateMoveAnimationOffset(tileSize)
    {
        if (!this._player.isMoving()) {
            return new Size(0, 0);
        }

        let moveFrom = this._player.getMovingFromPosition();
        let currentPos = this._player.getCurrentPosition();
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

        return new Size(offsetX, offsetY);
    }

    /**
     * @returns {int}
     */
    getX()
    {
        return this._player.getCurrentPosition().getX();
    }

    /**
     * @returns {int}
     */
    getY()
    {
        return this._player.getCurrentPosition().getY();
    }

    /**
     * @returns {string}
     */
    getName()
    {
        return this._player.name();
    }

    /**
     * @param {string} text
     */
    say(text)
    {
        this._messages.unshift(new MessageUI(text));

        if (this._messages.length > 6) {
            this._messages.pop();
        }
    }

    /**
     * @return {MessageUI[]}
     */
    getMessages()
    {
        let visibleMessages = [];

        for (let message of this._messages) {
            if (message.isVisible()) {
                visibleMessages.push(message);
            }
        }
        return visibleMessages;
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
}