'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import ClientMessages from './../../Common/Network/ClientMessages';

export default class SayMessage extends Message
{
    /**
     * @param {string} message
     */
    constructor(message)
    {
        super();

        Assert.string(message);

        this._name = ClientMessages.MESSAGE;
        this._data = {message: message};
    }
}