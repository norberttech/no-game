'use strict';

import Assert from './../../JSAssert/Assert';
import Kernel from './Kernel';
import Tile from './Map/Tile';
import Area from './Map/Area';
import Player from './Player';
import Position from './Position';
import Directions from './Directions';
import Character from './Character';
import Connection from './Network/Connection';
import LoginMessage from './Network/LoginMessage';
import MoveMessage from './Network/MoveMessage';
import SayMessage from './Network/SayMessage';
import ServerMessages from './../Common/Network/ServerMessages';
import KeyBoard from './UserInterface/KeyBoard';
import Keys from './UserInterface/Keys';
import PlayerSpeed from './../Common/PlayerSpeed';

export default class Client
{
    /**
     * @param {string} serverAddress
     * @param {Kernel} kernel
     * @param {KeyBoard} keyboard
     */
    constructor(serverAddress, kernel, keyboard)
    {
        Assert.string(serverAddress);
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(keyboard, KeyBoard);

        this._kernel = kernel;
        this._serverAddress = serverAddress;
        this._isConnected = false;
        this._isLoggedIn = false;
        this._onCharacterSay = null;
        this._keyboard = keyboard;
        this._moveLock = false;
        setInterval(this._gameLoop.bind(this), 1000 / 60);
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
    _onMessage(event, connection)
    {
        let message = JSON.parse(event.data);
        console.log(`Received: ${event.data.substr(0, 150)}`);

        this._handleMessage(message, connection);
    }

    _gameLoop()
    {
        if (this._keyboard.isKeyPressed(Keys.LEFT)) {
            this._move(this._playerPosition().next(Directions.LEFT));
            return ;
        }

        if (this._keyboard.isKeyPressed(Keys.RIGHT)) {
            this._move(this._playerPosition().next(Directions.RIGHT));
            return ;
        }

        if (this._keyboard.isKeyPressed(Keys.UP)) {
            this._move(this._playerPosition().next(Directions.UP));
            return ;
        }

        if (this._keyboard.isKeyPressed(Keys.DOWN)) {
            this._move(this._playerPosition().next(Directions.DOWN));
            return ;
        }
    }

    /**
     * @returns {Position}
     * @private
     */
    _playerPosition()
    {
        return this._player().getCurrentPosition();
    }

    /**
     * @param {Position} position
     * @private
     */
    _move(position)
    {
        if (this._isLoggedIn && this._kernel.canMoveTo(position.getX(), position.getY())) {

            if (this._player().isMoving()) {
                return ;
            }

            this._connection.send(new MoveMessage(position.getX(), position.getY()));

            let moveTime = PlayerSpeed.calculateMoveTime(
                1,
                this._kernel.area().tile(position.getX(), position.getY()).moveSpeedModifier()
            );

            // add extra 50ms to handle latency - need to find better way for that
            moveTime += 50;

            this._kernel.move(
                position.getX(),
                position.getY(),
                moveTime
            );
        }
    }

    /**
     * @returns {Player}
     * @private
     */
    _player()
    {
        return this._kernel.player();
    }

    _handleMessage(message, connection)
    {
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
                    message.data.visibleTiles.x,
                    message.data.visibleTiles.y
                );
                break;
            case ServerMessages.MOVE:
                if (!this._kernel.player().isMovingTo(message.data.x, message.data.y)) {
                    this._player().cancelMove();
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
                            characterData.position.y
                        )
                    );
                }
                this._kernel.setCharacters(characters);
                break;
            case ServerMessages.CHARACTER_MOVE:
                if (this._kernel.hasCharacter(message.data.id)) {
                    this._kernel.character(message.data.id).move(message.data.from.x, message.data.from.y);
                    this._kernel.characterMove(message.data.id, message.data.to.x, message.data.to.y, message.data.moveTime);
                } else {
                    this._kernel.addCharacter(new Character(
                        message.data.id,
                        message.data.name,
                        message.data.from.x,
                        message.data.from.y
                    ));
                    this._kernel.characterMove(message.data.id, message.data.to.x, message.data.to.y, message.data.moveTime);
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
            case ServerMessages.BATCH_MESSAGE:
                let rawMessages = message.data.messages;

                for (let rawMessage of rawMessages) {
                    this._handleMessage(JSON.parse(rawMessage), connection);
                }

                break;
            default:
                console.log("Unhandled packet");
                console.log(message);
                break;
        }
    }
}