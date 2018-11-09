'use strict';

import Assert from 'assert-js';
import NetworkMessage from './../../Common/NetworkMessage';
import ClientMessages from './../../Common/ClientMessages';

export default class MoveMessage extends NetworkMessage
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