'use strict';

import Assert from './../../../JSAssert/Assert';

export default class Message
{
    /**
     * @param {string} name
     */
    constructor(name)
    {
        Assert.string(name);
    }
}