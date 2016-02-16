'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterSayMessage extends Message
{
    /**
     * @param {string} characterId
     * @param {string} message
     */
    constructor(characterId, message)
    {
        super();

        Assert.string(characterId);
        Assert.string(message);

        this._name = ServerMessages.CHARACTER_SAY;
        this._data = {
            id: characterId,
            message: message
        };
    }
}