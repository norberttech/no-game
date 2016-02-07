'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Messages from './Messages';

export default class LoginMessage extends Message
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        super();

        Assert.instanceOf(player, Player);

        this._name = Messages.LOGIN;
        this._data = {id: player.id()};
    }
}