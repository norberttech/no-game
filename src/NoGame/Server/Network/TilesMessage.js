'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Tile from './../../Engine/Map/Area/Tile';
import Player from './../../Engine/Player';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class TilesMessage extends Message
{
    /**
     * @param {Tile[]} tiles
     */
    constructor(tiles)
    {
        super();

        Assert.containsOnly(tiles, Tile);

        this._name = ServerMessages.TILES;
        this._data = {
            tiles: tiles.map((tile) => {
                return {
                    x: tile.position().x(),
                    y: tile.position().y(),
                    canWalkOn: tile.canWalkOn(),
                    stack: [
                        tile.ground().spriteId()
                    ],
                    monster: tile.monster,
                    players: tile.players,
                    moveSpeedModifier: tile.moveSpeedModifier()
                }
            })
        };
    }
}