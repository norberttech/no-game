'use strict';

import Assert from './../../JSAssert/Assert';
import Kernel from './Kernel';
import Tile from './Map/Tile';
import Area from './Map/Area';
import Player from './Player';
import Character from './Character';
import LoginMessage from './Network/LoginMessage';
import MoveMessage from './Network/MoveMessage';
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
    }

    /**
     * @param {function} onConnect
     */
    connect(onConnect)
    {
        Assert.isFunction(onConnect);

        this._connection = new WebSocket(
            this._serverAddress,
            "ws"
        );

        this._connection.onopen = () => {
            this._kernel.boot();
            onConnect(this);
            this._isConnected = true;
        };

        this._connection.onmessage = (event) => {
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
                    let area = new Area(message.data.name, 100, 100);
                    for (let tileData of message.data.tiles) {
                        area.addTile(new Tile(tileData.x, tileData.y, tileData.canWalkOn, tileData.stack));
                    }
                    this._kernel.setArea(area);
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
                    this._kernel.characterMove(message.data.id, message.data.x, message.data.y);
                    break;
            }

            console.log(message);
        };
    }

    /**
     * @param {function} callback
     */
    onDisconnect(callback)
    {
        Assert.isFunction(callback);

        this._connection.onclose = () => {
            callback(this);
            this._isConnected = false;
        };

        this._isLoggedIn = false;
    }

    /**
     * @param {string} username
     */
    login(username)
    {
        Assert.string(username);

        if (this._isConnected) {
            this._connection.send(new LoginMessage(username).toString());
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