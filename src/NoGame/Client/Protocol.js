'use strict';

import Assert from 'assert-js';
import Player from './Player';
import Tile from './Map/Tile';
import Area from './Map/Area';
import Character from './Character';
import ServerMessages from './../Common/Network/ServerMessages';

const LATENCY_DELAY = 50;

export default class Protocol
{
    constructor(kernel)
    {
        this._kernel = kernel;
        this._onLogin = null;
        this._onCharacterSay = null;
    }

    /**
     * @param {function} callback
     */
    onLogin(callback)
    {
        Assert.isFunction(callback);

        this._onLogin = callback;
    }

    /**
     * @param {function} callback
     */
    onCharacterSay(callback)
    {
        Assert.isFunction(callback);

        this._onCharacterSay = callback;
    }

    parseMessage(message, connection)
    {
        switch (message.name) {
            case ServerMessages.LOGIN:
                this._kernel.draw();
                this._kernel.login(
                    new Player(
                        message.data.id,
                        message.data.name,
                        message.data.health,
                        message.data.maxHealth,
                        message.data.position.x,
                        message.data.position.y
                    )
                );
                this._isLoggedIn = true;

                if (this._onLogin !== null) {
                    this._onLogin(this);
                }

                break;
            case ServerMessages.AREA:
                this._kernel.setArea(new Area(message.data.name));
                this._kernel.setVisibleTiles(
                    message.data.visibleTiles.x,
                    message.data.visibleTiles.y
                );
                break;
            case ServerMessages.MOVE:
                if (!this._kernel.player().isMovingTo(message.data.x, message.data.y)) {
                    this._kernel.clearWalkPath();
                    this._kernel.player().cancelMove();
                }
                break;
            case ServerMessages.CHARACTERS:
                let characters = [];
                for (let characterData of message.data.characters) {
                    characters.push(
                        new Character(
                            characterData.id,
                            characterData.name,
                            characterData.position.x,
                            characterData.position.y,
                            characterData.health,
                            characterData.maxHealth,
                            characterData.type
                        )
                    );
                }

                this._kernel.setCharacters(characters);
                break;
            case ServerMessages.MONSTER_MOVE:
            case ServerMessages.CHARACTER_MOVE:
                if (this._kernel.hasCharacter(message.data.id)) {
                    this._kernel.characterMove(
                        message.data.id,
                        message.data.to.x,
                        message.data.to.y,
                        message.data.moveTime + LATENCY_DELAY
                    );
                } else {
                    this._kernel.addCharacter(new Character(
                        message.data.id,
                        message.data.name,
                        message.data.from.x,
                        message.data.from.y
                    ));
                    this._kernel.characterMove(
                        message.data.id,
                        message.data.to.x,
                        message.data.to.y,
                        message.data.moveTime + LATENCY_DELAY
                    );
                }
                break;
            case ServerMessages.MONSTER_ATTACK:
                if (message.data.attacking === true) {
                    this._kernel.player().attackedBy(message.data.id);
                } else {
                    this._kernel.player().removeAttacker(message.data.id);
                }
                break;
            case ServerMessages.CHARACTER_SAY:
                let character = this._kernel.character(message.data.id);
                if (null !== this._onCharacterSay) {
                    this._onCharacterSay(character.getName(), message.data.message);
                }

                this._kernel.getGfx().characterSay(character.id(), message.data.message);
                break;
            case ServerMessages.TILES:
                let tiles = message.data.tiles.map((tileData) => {
                    return new Tile(
                        tileData.x,
                        tileData.y,
                        tileData.canWalkOn,
                        tileData.stack,
                        tileData.moveSpeedModifier
                    );
                });

                this._kernel.area().setTiles(tiles);
                break;
            case ServerMessages.TILE:
                let tile = new Tile(
                        message.data.x,
                        message.data.y,
                        message.data.canWalkOn,
                        message.data.stack,
                        message.data.moveSpeedModifier
                );

                this._kernel.area().setTile(tile);
                break;
            case ServerMessages.BATCH_MESSAGE:
                let rawMessages = message.data.messages;

                for (let rawMessage of rawMessages) {
                    this.parseMessage(JSON.parse(rawMessage), connection);
                }

                break;
            default:
                console.log("Unhandled packet");
                console.log(message);
                break;
        }
    }
}