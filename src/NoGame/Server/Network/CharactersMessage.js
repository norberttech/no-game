'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharactersMessage extends Message
{
    /**
     * @param {Player[]} players
     */
    constructor(players)
    {
        super();

        Assert.containsOnly(players, Player);

        let charactersData = [];

        for (let player of players) {
            charactersData.push(
                {
                    id: player.id(),
                    name: player.name(),
                    position: {
                        x: player.currentPosition().x(),
                        y: player.currentPosition().y()
                    }
                }
            )
        }

        this._name = ServerMessages.CHARACTERS;
        this._data = {
            characters: charactersData
        };
    }
}