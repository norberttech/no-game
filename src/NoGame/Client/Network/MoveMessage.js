'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Messages from './Messages';

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

        this._name = Messages.MOVE;
        this._data = {
            x: x,
            y: y
        };
    }
}