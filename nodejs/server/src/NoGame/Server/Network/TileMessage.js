'use strict';

const Assert = require('assert-js');
const Message = require('./../../Common/Network/Message');
const Tile = require('./../../Engine/Map/Area/Tile');
const Player = require('./../../Engine/Player');
const ServerMessages = require('./../../Common/Network/ServerMessages');

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
            stack: [
                tile.ground.spriteId
            ],
            monster: tile.monster,
            players: tile.players,
            moveSpeedModifier: tile.moveSpeedModifier
        };
    }
}

module.exports = TileMessage;