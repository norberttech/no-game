'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import ClientMessages from './../../Common/Network/ClientMessages'

export default class MoveMessage extends Message
{
    /**
     * @param {int} x
     * @param {int} y
     */
    constructor(x, y)
    {
        super();

        Assert.integer(x);
        Assert.integer(y);

        this._name = ClientMessages.MOVE;
        this._data = {
            x: x,
            y: y
        };
    }
}