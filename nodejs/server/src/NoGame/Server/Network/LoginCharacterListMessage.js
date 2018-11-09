'use strict';

const Assert = require('assert-js');
const AccountCharacter = require('./../../Engine/Account/AccountCharacter');
const NetworkMessage = require('./../../Common/NetworkMessage');
const ServerMessages = require('./../../Common/ServerMessages');

class LoginCharacterListMessage extends NetworkMessage
{
    /**
     * @param {array<AccountCharacter>} characters
     */
    constructor(characters)
    {
        super();
        Assert.containsOnly(characters, AccountCharacter);

        this._name = ServerMessages.LOGIN_CHARACTER_LIST;
        this._data = {
            characters: characters.map(function(character) {
                return {
                    id: character.id,
                    name: character.name
                };
            })
        };
    }
}

module.exports = LoginCharacterListMessage;