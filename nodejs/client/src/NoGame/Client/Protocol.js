'use strict';

import Assert from 'assert-js';
import {MoveSpeed} from 'nogame-common';
import {ServerMessages} from 'nogame-common';
import Player from './Player';
import Tile from './Map/Tile';
import Area from './Map/Area';
import Position from './Position';
import Character from './Character';
import Kernel from './Kernel';
import Connection from './Network/Connection';
import LoginMessage from './Network/LoginMessage';
import LoginCharacterMessage from './Network/LoginCharacterMessage';
import SayMessage from './Network/SayMessage';
import AttackMonsterMessage from './Network/AttackMonsterMessage';
import MoveMessage from './Network/MoveMessage';
import UserInterface from './UserInterface';

const LATENCY_DELAY = 50;

export default class Protocol
{
    /**
     * @param {Kernel} kernel
     * @param {UserInterface} ui
     * @param {Connection} connection
     */
    constructor(kernel, ui, connection)
    {
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(ui, UserInterface);
        Assert.instanceOf(connection, Connection);

        this._kernel = kernel;
        this._ui = ui;
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
     * @param {string} password
     */
    login(username, password)
    {
        Assert.string(username);
        Assert.string(password);

        this._connection.send(new LoginMessage(username, password));
    }

    /**
     * NOTE: This function is very unsecured, it needs to have additional time expired token generated for account
     * to make sure that only people that sent valid username/password are able to login.
     * This feature will be added next.
     *
     * @param {string} characterId
     */
    loginCharacter(characterId)
    {
        Assert.string(characterId);

        this._connection.send(new LoginCharacterMessage(characterId));
    }

    /**
     * @param {string} characterId
     */
    attack(characterId)
    {
        Assert.string(characterId);

        this._kernel.player.attack(characterId);
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

        if (this._kernel.canMoveTo(position.x, position.y)) {

            if (this._kernel.player.isMoving) {
                return;
            }

            this._connection.send(new MoveMessage(position.x, position.y));

            let moveTime = MoveSpeed.calculateMoveTime(
                1,
                this._kernel.area.tile(position.x, position.y).moveSpeedModifier
            );

            // add extra 50ms to handle latency - need to find better way for that
            moveTime += LATENCY_DELAY;

            this._kernel.move(position.x, position.y, moveTime);
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
                        message.data.experience,
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
                this._ui.hideLoginScreen();
                this._ui.chat().setCurrentUsername(message.data.name);
                this._ui.characterList.hide();
                this._ui.showCanvas();
                break;
            case ServerMessages.LOGIN_ACCOUNT_NOT_FOUND:
                this._ui.addErrorMessage("Account not found.");

                break;
            case ServerMessages.LOGIN_CHARACTER_LIST:
                this._ui.hideLoginScreen();
                this._ui.characterList.show();
                message.data.characters.map((characterData) => {
                    this._ui.characterList.addCharacter(characterData.id, characterData.name)
                });

                if (!message.data.characters.length) {
                    this._ui.characterList.emptyList();
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
            case ServerMessages.PLAYER_MOVE:
                if (!this._kernel.player.isMovingTo(message.data.x, message.data.y)) {
                    this._kernel.clearWalkPath();
                    this._kernel.player.cancelMove();
                }
                break;
            case ServerMessages.PLAYER_EARN_EXPERIENCE:
                this._kernel.player.earnExperience()
                break;
            case ServerMessages.CHARACTERS:
                let characters = [];
                for (let characterData of message.data.characters) {
                    characters.push( new Character(
                            characterData.id,
                            characterData.name,
                            characterData.position.x,
                            characterData.position.y,
                            characterData.health,
                            characterData.maxHealth,
                            characterData.type
                    ));
                }

                this._kernel.updateCharacters(characters);
                break;
            case ServerMessages.CHARACTER_HEALTH:
                if (message.data.id === this._kernel.player.id) {
                    this._kernel.playerLooseHealth(message.data.newValue);
                } else {
                    this._kernel.characterLooseHealth(message.data.id, message.data.newValue);
                }
                break;
            case ServerMessages.CHARACTER_PARRY:
                if (message.data.id === this._kernel.player.id) {
                    this._kernel.playerParry();
                } else {
                    this._kernel.characterParry(message.data.id);
                }
                break;
            case ServerMessages.CHARACTER_DIED:
                    this._kernel.removeCharacter(message.data.id);
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
                    this._kernel.player.attackedBy(message.data.id);
                } else {
                    this._kernel.player.removeAttacker(message.data.id);
                }
                break;
            case ServerMessages.CHARACTER_SAY:
                let character = this._kernel.getCharacter(message.data.id);
                if (null !== this._onCharacterSay) {
                    this._onCharacterSay(character.name, message.data.message);
                }

                this._kernel.gfx.characterSay(character.id, message.data.message);
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

                this._kernel.area.setTiles(tiles);
                break;
            case ServerMessages.TILE:
                let tile = new Tile(
                    message.data.x,
                    message.data.y,
                    message.data.canWalkOn,
                    message.data.stack,
                    message.data.moveSpeedModifier
                );

                this._kernel.area.setTile(tile);
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