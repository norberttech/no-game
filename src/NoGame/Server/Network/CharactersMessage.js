'use strict';

import Assert from 'assert-js';
import Message from './../../Common/Network/Message';
import Player from './../../Engine/Player';
import Monster from './../../Engine/Monster';
import Position from './../../Engine/Map/Area/Position';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class CharactersMessage extends Message
{
    /**
     * @param {Player[]} [players]
     * @param {Monster[]} [monsters]
     */
    constructor(players = [], monsters = [])
    {
        super();

        Assert.containsOnly(players, Player);
        Assert.containsOnly(monsters, Monster);

        let charactersData = [];

        for (let player of players) {
            charactersData.push(
                {
                    id: player.id(),
                    type: 1,
                    name: player.name(),
                    position: {
                        x: player.currentPosition().x(),
                        y: player.currentPosition().y()
                    }
                }
            )
        }

        for (let monster of monsters) {
            charactersData.push(
                {
                    id: monster.id,
                    type: 2,
                    name: monster.name,
                    position: {
                        x: monster.position.x(),
                        y: monster.position.y()
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