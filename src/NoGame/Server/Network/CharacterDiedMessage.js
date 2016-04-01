'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterDiedMessage extends Message
{
    /**
     * @param {string} characterId
     * @param {string} killerId
     */
    constructor(characterId, killerId)
    {
        super();

        Assert.string(characterId);
        Assert.string(killerId);

        this._name = ServerMessages.CHARACTER_DIED;
        this._data = {
            id: characterId,
            killer: killerId
        };
    }
}