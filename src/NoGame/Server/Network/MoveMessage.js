'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class MoveMessage extends Message
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        super();

        Assert.instanceOf(player, Player);

        this._name = ServerMessages.MOVE;
        this._data = {
            x: player.currentPosition().x(),
            y: player.currentPosition().y(),
            moveTime: player.moveEnds() - new Date()
        };
    }
}