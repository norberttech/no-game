'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Messages from './Messages';

export default class LoginMessage extends Message
{
    /**
     * @param {string} playername
     */
    constructor(playername)
    {
        super();

        Assert.string(playername);

        this._name = Messages.LOGIN;
        this._data = {username: playername};
    }
}