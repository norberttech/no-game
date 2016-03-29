'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterHealthMessage extends Message
{
    /**
     * @param {int} characterId
     * @param {int} oldValue
     * @param {int} newValue
     */
    constructor(characterId, oldValue, newValue)
    {
        super();

        Assert.integer(oldValue);
        Assert.integer(newValue);

        this._name = ServerMessages.CHARACTER_HEALTH;
        this._data = {
            id: characterId,
            oldValue: oldValue,
            newValue: newValue
        };
    }
}