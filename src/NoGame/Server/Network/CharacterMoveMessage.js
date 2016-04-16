'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharacterMoveMessage extends Message
{
    /**
     * @param {Player} player
     * @param {Position} fromPosition
     */
    constructor(player, fromPosition)
    {
        super();

        Assert.instanceOf(fromPosition, Position);
        Assert.instanceOf(player, Player);

        this._name = ServerMessages.CHARACTER_MOVE;
        this._data = {
            id: player.id,
            name: player.name,
            moveTime: player.moveEnds - new Date(),
            type: 1,
            health: player.health,
            maxHealth: player.maxHealth,
            from: {
                x: fromPosition.x,
                y: fromPosition.y
            },
            to: {
                x: player.position.x,
                y: player.position.y
            }
        };
    }
}