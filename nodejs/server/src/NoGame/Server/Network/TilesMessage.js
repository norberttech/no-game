'use strict';

const Assert = require('assert-js');
const Message = require('./../../../../src/NoGame/Common/NetworkMessage');
const Tile = require('./../../Engine/Map/Area/Tile');
const ServerMessages = require('./../../../../src/NoGame/Common/ServerMessages');

class TilesMessage extends Message
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
                    x: tile.position.x,
                    y: tile.position.y,
                    canWalkOn: tile.canWalkOn,
                    ground: tile.ground.spriteId,
                    stack: tile.stack.map((item) => {
                        return item.spriteId;
                    }),
                    monster: tile.monster,
                    players: tile.players,
                    moveSpeedModifier: tile.moveSpeedModifier
                }
            })
        };
    }
}

module.exports = TilesMessage;