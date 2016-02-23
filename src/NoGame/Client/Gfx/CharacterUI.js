'use strict';

import Assert from './../../../JSAssert/Assert';
import PlayerUI from './PlayerUI';
import Character from './../Character';
import Size from './Size';
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

    _getProgress(distance)
    {
        let duration = this._character.getMoveTime();
        let progress = Math.min((duration - (this._character.getMoveEnds() - new Date().getTime())) / duration, 1);

        return Math.round(distance * progress);
    }
}