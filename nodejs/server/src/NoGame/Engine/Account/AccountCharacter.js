'use strict';

const Assert = require('assert-js');

class AccountCharacter
{
    /**
     * @param {string} id
     * @param {string} name
     */
    constructor(id, name)
    {
        Assert.string(id);
        Assert.string(name);

        this._id = id;
        this._name = name;
    }

    get id()
    {
        return this._id;
    }

    get name()
    {
        return this._name;
    }
}

module.exports = AccountCharacter;