'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Tile = require('./../../Engine/Map/Area/Tile');
const Player = require('./../../Engine/Player');
const ServerMessages = require('nogame-common').ServerMessages;

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
                    stack: [
                        tile.ground.spriteId
                    ],
                    monster: tile.monster,
                    players: tile.players,
                    moveSpeedModifier: tile.moveSpeedModifier
                }
            })
        };
    }
}

module.exports = TilesMessage;