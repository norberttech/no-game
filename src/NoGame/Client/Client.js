'use strict';

import Assert from './../../JSAssert/Assert';
import Kernel from './Kernel';
import Tile from './Map/Tile';
import Area from './Map/Area';
import Player from './Player';
import Character from './Character';
import Connection from './Network/Connection';
import LoginMessage from './Network/LoginMessage';
import MoveMessage from './Network/MoveMessage';
import SayMessage from './Network/SayMessage';
import ServerMessages from './../Common/Network/ServerMessages';

export default class Client
{
    /**
     * @param {string} serverAddress
     * @param {Kernel} kernel
     */
    constructor(serverAddress, kernel)
    {
        Assert.string(serverAddress);
        Assert.instanceOf(kernel, Kernel);

        this._kernel = kernel;
        this._serverAddress = serverAddress;
        this._isConnected = false;
        this._isLoggedIn = false;
        this._onCharacterSay = null;
    }

    /**
     * @param {string} username
     */
    login(username)
    {
        Assert.string(username);

        if (this._isConnected) {
            this._connection.send(new LoginMessage(username));
        }
    }

    /**
     * @param {string} message
     */
    say(message)
    {
        Assert.string(message);

        if (this._isLoggedIn) {
            this._connection.send(new SayMessage(message));
        }
    }

    moveLeft()
    {
        let x = this._kernel.player().position().x - 1;
        let y = this._kernel.player().position().y;

        this._move(x, y);
    }

    moveDown()
    {
        let x = this._kernel.player().position().x;
        let y = this._kernel.player().position().y + 1;

        this._move(x, y);
    }

    moveRight()
    {
        let x = this._kernel.player().position().x + 1;
        let y = this._kernel.player().position().y;

        this._move(x, y);
    }

    moveUp()
    {
        let x = this._kernel.player().position().x;
        let y = this._kernel.player().position().y - 1;

        this._move(x, y);
    }

    /**
     * @param {function} onConnect
     */
    connect(onConnect)
    {
        Assert.isFunction(onConnect);

        this._connection = new Connection(new WebSocket(
            this._serverAddress,
            "ws"
        ));

        this._connection.bindOnOpen((connection) => {
            this._kernel.boot();
            onConnect(this);
            this._isConnected = true;
        });

        this._connection.bindOnMessage(this._onMessage.bind(this));
    }

    /**
     * @param {function} callback
     */
    onDisconnect(callback)
    {
        Assert.isFunction(callback);

        this._connection.bindOnClose((connection) => {
            callback(this);
            this._isConnected = false;
            this._isLoggedIn = false;
        });
    }

    /**
     * @param {function} callback
     */
    onCharacterSay(callback)
    {
        Assert.isFunction(callback);

        this._onCharacterSay = callback;
    }

    /**
     * @param {object} event
     * @param {Connection} connection
     * @private
     */
    _onMessage(event, connection) {
        let message = JSON.parse(event.data);

        switch (message.name) {
            case ServerMessages.LOGIN:
                this._kernel.draw();
                this._kernel.login(
                    new Player(
                        message.data.id,
                        message.data.name,
                        message.data.position.x,
                        message.data.position.y
                    )
                );
                this._isLoggedIn = true;
                break;
            case ServerMessages.AREA:
                this._kernel.setArea(new Area(message.data.name));
                this._kernel.setVisibleTiles(
                    message.data.visibleTiles.x - 2,
                    message.data.visibleTiles.y - 2
                );
                break;
            case ServerMessages.MOVE:
                this._kernel.player().move(message.data.x, message.data.y);
                break;
            case ServerMessages.CHARACTERS:
                let characters = [];
                for (let characterData of message.data.characters) {
                    characters.push(
                        new Character(
                            characterData.id,
                            characterData.name,
                            characterData.position.x,
                            characterData.position.y
                        )
                    );
                }
                this._kernel.setCharacters(characters);
                break;
            case ServerMessages.CHARACTER_MOVE:
                if (this._kernel.hasCharacter(message.data.id)) {
                    this._kernel.character(message.data.id).move(message.data.position.x, message.data.position.y);
                } else {
                    this._kernel.addCharacter(new Character(
                        message.data.id,
                        message.data.name,
                        message.data.position.x,
                        message.data.position.y
                    ));
                }
                break;
            case ServerMessages.CHARACTER_SAY:
                let character = this._kernel.character(message.data.id);
                if (null !== this._onCharacterSay) {
                    this._onCharacterSay(character.name(), message.data.message);
                }

                break;
            case ServerMessages.TILES:
                let tiles = message.data.tiles.map((tileData) => {
                    return new Tile(tileData.x, tileData.y, tileData.canWalkOn, tileData.stack);
                });

                this._kernel.area().setTiles(tiles);
                break;
            default:
                break;
        }

        console.log(message);
    }

    /**
     * @param {int} x
     * @param {int} y
     * @private
     */
    _move(x, y)
    {
        if (this._isLoggedIn && this._kernel.canMoveTo(x, y)) {
            this._connection.send(new MoveMessage(x, y));
        }
    }
}