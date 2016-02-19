'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterMoveMessage extends Message
{
    /**
     * @param {Player} player
     */
    constructor(player)
    {
        super();

        Assert.instanceOf(player, Player);

        this._name = ServerMessages.CHARACTER_MOVE;
        this._data = {
            id: player.id(),
            name: player.name(),
            moveTime: player.moveEnds() - new Date(),
            position: {
                x: player.currentPosition().x(),
                y: player.currentPosition().y()
            }
        };
    }
}