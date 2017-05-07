'use strict';

import Assert from 'assert-js';
import {NetworkMessage} from 'nogame-common';
import {ClientMessages} from 'nogame-common';

export default class LoginMessage extends NetworkMessage
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