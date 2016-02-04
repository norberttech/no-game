'use strict';

import Assert from './../../../../JSAssert/Assert';


export default class Item
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
    isBlocking()
    {
        return this._blocking;
    }

    spriteId()
    {
        return this._spriteId;
    }
}
