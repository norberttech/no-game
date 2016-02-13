'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Messages from './Messages';
import Position from './../../Engine/Map/Area/Position';

export default class MoveMessage extends Message
{
    /**
     * @param {Position} position
     */
    constructor(position)
    {
        super();

        Assert.instanceOf(position, Position);

        this._name = Messages.MOVE;
        this._data = {
            x: position.x(),
            y: position.y()
        };
    }
}