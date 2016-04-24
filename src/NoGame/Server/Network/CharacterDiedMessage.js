'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterDiedMessage extends Message
{
    /**
     * @param {string} characterId
     */
    constructor(characterId)
    {
        super();

        Assert.string(characterId);

        this._name = ServerMessages.CHARACTER_DIED;
        this._data = {
            id: characterId
        };
    }
}