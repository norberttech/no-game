'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import ClientMessages from './../../Common/Network/ClientMessages';

export default class LoginMessage extends Message
{
    /**
     * @param {string} playername
     */
    constructor(playername)
    {
        super();

        Assert.string(playername);

        this._name = ClientMessages.LOGIN;
        this._data = {username: playername};
    }
}