'use strict';

import MoveSpeed from './../Common/MoveSpeed';

import Assert from 'assert-js';
import Player from './Player';
import Tile from './Map/Tile';
import Area from './Map/Area';
import Position from './Position';
import Character from './Character';
import Kernel from './Kernel';
import Connection from './Network/Connection';
import ServerMessages from './../Common/Network/ServerMessages';
import LoginMessage from './Network/LoginMessage';
import SayMessage from './Network/SayMessage';
import AttackMonsterMessage from './Network/AttackMonsterMessage';
import MoveMessage from './Network/MoveMessage';

const LATENCY_DELAY = 50;

export default class Protocol
{
    /**
     * @param {Kernel} kernel
     * @param {Connection} connection
     */
    constructor(kernel, connection)
    {
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(connection, Connection);

        this._kernel = kernel;
        this._connection = connection;
        this._onLogin = null;
        this._onLogout = null;
        this._onCharacterSay = null;
    }

    /**
     * @returns {Connection}
     */
    get connection()
    {
        return this._connection;
    }

    /**
     * @param {string} username
     */
    login(username)
    {
        Assert.string(username);

        this._connection.send(new LoginMessage(username));
    }

    /**
     * @param {string} characterId
     */
    attack(characterId)
    {
        Assert.string(characterId);

        this._kernel.player().attack(characterId);
        this._connection.send(new AttackMonsterMessage(characterId));
    }

    /**
     * @param {string} message
     */
    say(message)
    {
        Assert.string(message);

        this._connection.send(new SayMessage(message));
        this._kernel.gfx.playerSay(message);
    }

    /**
     * @param {Position} position
     */
    move(position)
    {
        Assert.instanceOf(position, Position);

        if (this._kernel.canMoveTo(position.getX(), position.getY())) {

            if (this._kernel.player().isMoving()) {
                return;
            }

            this._connection.send(new MoveMessage(position.getX(), position.getY()));

            let moveTime = MoveSpeed.calculateMoveTime(
                1,
                this._kernel.area().tile(position.getX(), position.getY()).moveSpeedModifier()
            );

            // add extra 50ms to handle latency - need to find better way for that
            moveTime += LATENCY_DELAY;

            this._kernel.move(position.getX(), position.getY(), moveTime);
        } else {
            this._kernel.clearWalkPath();
        }
    }

    /**
     * @param {string} message
     * @param {Connection} connection
     */
    parseMessage(message, connection)
    {
        switch (message.name) {
            case ServerMessages.LOGIN:
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
                    this._onLogin();
                }

                break;
            case ServerMessages.LOGOUT:
                this._kernel.logout();

                if (this._onLogout !== null) {
                    this._onLogout(message.data.reason);
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
            case ServerMessages.CHARACTER_HEALTH:
                if (message.data.id === this._kernel.player().id()) {
                    this._kernel.player().changeHealth(message.data.newValue);
                } else {
                    this._kernel.character(message.data.id).changeHealth(message.data.newValue);
                }
                break;
            case ServerMessages.CHARACTER_DIED:
                    this._kernel.killCharacter(message.data.id);
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
                        message.data.from.y,
                        message.data.health,
                        message.data.maxHealth,
                        message.data.type
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
    onLogout(callback)
    {
        Assert.isFunction(callback);

        this._onLogout = callback;
    }

    /**
     * @param {function} callback
     */
    onCharacterSay(callback)
    {
        Assert.isFunction(callback);

        this._onCharacterSay = callback;
    }
}