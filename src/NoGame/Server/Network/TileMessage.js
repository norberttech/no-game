'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Tile from './../../Engine/Map/Area/Tile';
import Player from './../../Engine/Player';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class TileMessage extends Message
{
    /**
     * @param {Tile} tile
     */
    constructor(tile)
    {
        super();

        Assert.instanceOf(tile, Tile);

        this._name = ServerMessages.TILE;
        this._data = {
            x: tile.position.x,
            y: tile.position.y,
            canWalkOn: tile.canWalkOn,
            stack: [
                tile.ground.spriteId
            ],
            monster: tile.monster,
            players: tile.players,
            moveSpeedModifier: tile.moveSpeedModifier
        };
    }
}