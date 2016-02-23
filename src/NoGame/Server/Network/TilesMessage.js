'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Tile from './../../Engine/Map/Area/Tile';
import Player from './../../Engine/Player';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class TilesMessage extends Message
{
    /**
     * @param {Tile[]} tiles
     * @param {Player[]} characters
     */
    constructor(tiles, characters)
    {
        super();

        Assert.containsOnly(tiles, Tile);
        Assert.containsOnly(characters, Player);

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
                    moveSpeedModifier: tile.moveSpeedModifier()
                }
            }),
            characters: characters.map((character) => {
                return {
                    id: character.id(),
                    name: character.name(),
                    position: {
                        x: character.currentPosition().x(),
                        y: character.currentPosition().y()
                    }
                }
            })
        };
    }
}