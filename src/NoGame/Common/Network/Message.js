'use strict';

import Assert from 'assert-js';

export default class Message
{
    constructor()
    {
        this._name = null;
        this._data = {};
        this._index = 0;
    }

    /**
     * @returns {object}
     */
    get data()
    {
        return this._data;
    }

    /**
     * @returns {string|null}
     */
    get name()
    {
        return this._name;
    }

    /**
     * @param {int} index
     */
    setIndex(index)
    {
        Assert.integer(index);

        this._index = index;
    }

    /**
     * @return {string}
     */
    toString()
    {
        return JSON.stringify({index: this._index, name: this._name, data: this._data});
    }
}