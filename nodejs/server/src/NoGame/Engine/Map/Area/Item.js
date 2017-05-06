'use strict';

const Assert = require('assert-js');

class Item
{
    /**
     * @param {number} spriteId
     * @param {boolean} [blocking]
     */
    constructor(spriteId, blocking = false)
    {
        Assert.integer(spriteId);
        Assert.boolean(blocking);

        this._blocking = blocking;
        this._spriteId = spriteId;
    }

    /**
     * @returns {boolean}
     */
    get isBlocking()
    {
        return this._blocking;
    }

    get spriteId()
    {
        return this._spriteId;
    }
}

module.exports = Item;