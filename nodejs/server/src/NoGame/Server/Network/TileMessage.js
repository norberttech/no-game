'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Tile = require('./../../Engine/Map/Area/Tile');
const Player = require('./../../Engine/Player');
const ServerMessages = require('nogame-common').ServerMessages;

class TileMessage extends Message
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
            ground: tile.ground.spriteId,
            stack: tile.stack.map((item) => {
                return item.spriteId;
            }),
            monster: tile.monster,
            players: tile.players,
            moveSpeedModifier: tile.moveSpeedModifier
        };
    }
}

module.exports = TileMessage;