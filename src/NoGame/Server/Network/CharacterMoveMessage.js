'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterMoveMessage extends Message
{
    /**
     * @param {string} characterId
     * @param {Position} position
     */
    constructor(characterId, position)
    {
        super();

        Assert.instanceOf(position, Position);
        Assert.string(characterId);

        this._name = ServerMessages.CHARACTER_MOVE;
        this._data = {
            id: characterId,
            x: position.x(),
            y: position.y()
        };
    }
}