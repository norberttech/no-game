'use strict';

const Assert = require('assert-js');
const Size = require('./Size');
const Sprite = require('./Sprite');

const SINGLE_SPRITE_PX_SIZE = 128;

class SpriteFile
{
    /**
     * @param {string} name
     * @param {string} src
     * @param {int} startFrom
     * @param {int} rows
     * @param {int} columns
     */
    constructor(name, src, startFrom, rows = 20, columns = 20)
    {
        Assert.string(name);
        Assert.string(src);
        Assert.integer(startFrom);
        Assert.integer(rows);
        Assert.integer(columns);

        this._name = name;
        this._src = src;
        this._startFrom = startFrom;
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

        return this._startFrom <= id && id < (this._startFrom + this._size);
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


        let realId = id - this._startFrom - 1;
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

module.exports = SpriteFile;