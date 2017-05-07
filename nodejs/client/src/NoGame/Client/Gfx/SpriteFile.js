'use strict';

import Assert from 'assert-js';
import Size from './Size';
import Sprite from './Sprite';

const SINGLE_SPRITE_PX_SIZE = 128;

export default class SpriteFile
{
    /**
     * @param {string} name
     * @param {string} src
     * @param {integer} startId
     * @param {integer} rows
     * @param {integer} columns
     */
    constructor(name, src, startId, rows = 10, columns = 10)
    {
        Assert.string(name);
        Assert.string(src);
        Assert.integer(startId);
        Assert.integer(rows);
        Assert.integer(columns);

        this._name = name;
        this._src = src;
        this._startId = startId;
        this._size = rows * columns;
        this._rows = rows;
        this._columns = columns;
        this._img = null;
        this._isLoaded = false;
    }

    /**
     * @returns {string}
     */
    get name()
    {
        return this._name;
    }

    /**
     * @param {function} callback
     */
    load(callback)
    {
        Assert.isFunction(callback);

        this._img = new Image();
        this._img.onload = () => {
            callback(this);
            this._isLoaded = true;
        };

        this._img.src = this._src;
    }

    /**
     * @param {number} id
     */
    hasId(id)
    {
        Assert.integer(id);

        return this._startId <= id && id < (this._startId + this._size);
    }

    /**
     * @param {integer} id
     * @returns {Sprite}
     */
    getSprite(id)
    {
        Assert.greaterThan(0, id);

        if (!this.hasId(id)) {
            throw `Id "${id}" does not exists in sprite "${this._src}"`;
        }

        let realId = id - 1; // to prevent using ID 0
        let posX = Math.floor(realId % this._columns);
        let posY = Math.floor(realId / this._rows);

        return new Sprite(this._img, posX * SINGLE_SPRITE_PX_SIZE, posY * SINGLE_SPRITE_PX_SIZE, SINGLE_SPRITE_PX_SIZE, SINGLE_SPRITE_PX_SIZE);
    }

    /**
     * @returns {boolean}
     */
    isLoaded()
    {
        return this._isLoaded;
    }
}