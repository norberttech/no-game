'use strict';

import Assert from './../../../JSAssert/Assert';
import Size from './Size';
import Position from './Sprite/Position';

const SINGLE_SPRITE_PX_SIZE = 120;

export default class Sprite
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
    name()
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

        return this._startId >= id && id < (this._startId + this._size);
    }

    /**
     * @param {integer} id
     * @returns {Position}
     */
    getIdPosition(id)
    {
        Assert.integer(id);

        if (!this.hasId(id)) {
            throw `Id "${id}" does not exists in sprite "${this._src}"`;
        }

        console.log('TODO, calculate sprite position');

        return new Position(0, 0);
    }
    /**
     * @returns {boolean}
     */
    isLoaded()
    {
        return this._isLoaded;
    }
}