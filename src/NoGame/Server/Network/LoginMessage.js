'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class LoginMessage extends Message
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        super();

        Assert.instanceOf(player, Player);

        this._name = ServerMessages.LOGIN;
        this._data = {
            id: player.id(),
            name: player.name(),
            position: {
                x: player.currentPosition().x(),
                y: player.currentPosition().y()
            }
        };
    }
}