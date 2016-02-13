'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class MoveMessage extends Message
{
    /**
     * @param {Position} position
     */
    constructor(position)
    {
        super();

        Assert.instanceOf(position, Position);

        this._name = ServerMessages.MOVE;
        this._data = {
            x: position.x(),
            y: position.y()
        };
    }
}