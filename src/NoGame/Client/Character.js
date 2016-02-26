'use strict';

import Position from './Position';
import Assert from './../../JSAssert/Assert';

export default class Character
{
    /**
     * @param {string} id
     * @param {string} name
     * @param {int} x
     * @param {int} y
     */
    constructor(id, name, x, y)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.string(id);
        Assert.string(name);

        this._id = id;
        this._name = name;
        this._moves = [];
        this._moveFrom = new Position(x, y);
        this._position = new Position(x, y);
        this._moveTime = 0;
        this._moveEnds = new Date().getTime();
    }

    /**
     * @returns {string}
     */
    id()
    {
        return this._id;
    }

    /**
     * @returns {string}
     */
    getName()
    {
        return this._name;
    }

    /**
     * @returns {boolean}
     */
    isMoving()
    {
        let isMoving = new Date().getTime() < this._moveEnds;

        if (this._moves.length > 0 && !isMoving) {
            let move = this._moves.shift();

            this._moveFrom = move.moveFrom;
            this._position = move.position;
            this._moveTime = move.moveTime;
            this._moveEnds = move.moveEnds;
        } else {
            return isMoving;
        }

        return new Date().getTime() < this._moveEnds;
    }

    /**
     * @returns {int}
     */
    getMoveEnds()
    {
        return this._moveEnds;
    }

    /**
     * @returns {int}
     */
    getMoveTime()
    {
        return this._moveTime;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} moveTime
     */
    startMovingTo(x, y, moveTime)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.integer(moveTime);

        if (this._moves.length === 0) {
            this._moveTime = moveTime;
            this._moveFrom = this._position;
            this._position = new Position(x, y);
            this._moveEnds = new Date().getTime() + moveTime;
        } else {
            this._moves.push({
                moveFrom: this._position,
                position: new Position(x, y),
                moveTime: moveTime,
                moveEnds: new Date().getTime() + moveTime
            });
        }
    }


    /**
     * @returns {Position}
     */
    getCurrentPosition()
    {
        return this._position;
    }

    /**
     * @returns {Position}
     */
    getMovingFromPosition()
    {
        return this._moveFrom;
    }
}