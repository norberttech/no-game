'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterParryMessage extends Message
{
    /**
     * @param {string} characterId
     */
    constructor(characterId)
    {
        super();

        Assert.string(characterId);

        this._name = ServerMessages.CHARACTER_PARRY;
        this._data = {
            id: characterId
        };
    }
}