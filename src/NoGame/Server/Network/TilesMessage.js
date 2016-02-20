'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Tile from './../../Engine/Map/Area/Tile';
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
            tiles: tiles.map(function(tile) {
                return {
                    x: tile.position().x(),
                    y: tile.position().y(),
                    canWalkOn: tile.canWalkOn(),
                    stack: [
                        tile.ground().spriteId()
                    ],
                    moveSpeedModifier: tile.moveSpeedModifier()
                }
            })
        };
    }
}