'use strict';

const Assert = require('assert-js');
const AccountCharacter = require('./Account/AccountCharacter');

class Account
{
    /**
     * @param {string} id
     * @param {array<AccountCharacter>} characters
     */
    constructor(id, characters)
    {
        Assert.string(id);
        Assert.containsOnly(characters, AccountCharacter);

        this._id = id;
        this._characters = characters;
    }

    /**
     * @returns {array<AccountCharacter>}
     */
    get characters()
    {
        return this._characters;
    }
}

module.exports = Account;