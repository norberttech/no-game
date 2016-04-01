'use strict';

import Assert from 'assert-js';
import Kernel from './Kernel';
import Protocol from './Protocol';
import Position from './Position';
import Directions from './Directions';
import Connection from './Network/Connection';
import KeyBoard from './UserInterface/KeyBoard';
import Mouse from './UserInterface/Mouse';
import Keys from './UserInterface/Keys';
import MoveSpeed from './../Common/MoveSpeed';

import LoginMessage from './Network/LoginMessage';
import AttackMonsterMessage from './Network/AttackMonsterMessage';
import MoveMessage from './Network/MoveMessage';
import SayMessage from './Network/SayMessage';

const LATENCY_DELAY = 50;

export default class Client
{
    /**
     * @param {string} serverAddress
     * @param {Kernel} kernel
     * @param {KeyBoard} keyboard
     * @param {Mouse} mouse
     */
    constructor(serverAddress, kernel, keyboard, mouse)
    {
        Assert.string(serverAddress);
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(keyboard, KeyBoard);
        Assert.instanceOf(mouse, Mouse);

        this._kernel = kernel;
        this._mouse = mouse;
        this._serverAddress = serverAddress;
        this._isConnected = false;
        this._isLoggedIn = false;
        this._keyboard = keyboard;
        this._protocol = new Protocol(this._kernel);
        setInterval(this._gameLoop.bind(this), 1000 / 60);
        mouse.onClick(this._onMouseClick.bind(this));
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
            this._kernel.gfx.playerSay(message);
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
    onLogin(callback)
    {
        this._protocol.onLogin(() => {
            this._isLoggedIn = true;
            callback();
        });
    }

    /**
     * @param {function} callback - gets {string} reason as a argument
     */
    onLogout(callback)
    {
        this._protocol.onLogout((reason) => {
            this._isLoggedIn = false;
            callback(reason);
        });
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
        this._protocol.onCharacterSay(callback);
    }

    /**
     * @param {object} event
     * @param {Connection} connection
     * @private
     */
    _onMessage(event, connection)
    {
        let message = JSON.parse(event.data);
        console.log(`Received: ${message.name} - ${event.data.substr(0, 150)}`);

        this._protocol.parseMessage(message, connection);
    }

    _onMouseClick()
    {
        let mouseAbsolutePosition = this._kernel.gfx.getMouseAbsolutePosition();

        for (let character of this._kernel.characters) {
            if (character.getCurrentPosition().isEqual(mouseAbsolutePosition) && character.isMonster) {
                    this._kernel.player().attack(character.id());
                    this._connection.send(new AttackMonsterMessage(character.id()));
                return ;
            }
        }

        this._kernel.clearWalkPath();
        this._kernel.setWalkPath(this._kernel.gfx.getMouseRelativePosition());
    }

    /**
     * Client game loop
     *
     * @private
     */
    _gameLoop()
    {
        if (this._keyboard.isKeyPressed(Keys.LEFT)) {
            this._kernel.clearWalkPath();
            this._move(this._playerPosition().next(Directions.LEFT));
            return ;
        }

        if (this._keyboard.isKeyPressed(Keys.RIGHT)) {
            this._kernel.clearWalkPath();
            this._move(this._playerPosition().next(Directions.RIGHT));
            return ;
        }

        if (this._keyboard.isKeyPressed(Keys.UP)) {
            this._kernel.clearWalkPath();
            this._move(this._playerPosition().next(Directions.UP));
            return ;
        }

        if (this._keyboard.isKeyPressed(Keys.DOWN)) {
            this._kernel.clearWalkPath();
            this._move(this._playerPosition().next(Directions.DOWN));
            return ;
        }

        if (this._kernel.hasWalkPath()) {
            if (this._player().isMoving()) {
                return ;
            }

            this._move(this._kernel.getNextWalkPathPosition());
        }
    }

    /**
     * @param {Position} position
     * @private
     */
    _move(position)
    {
        if (!this._isLoggedIn) {
            return ;
        }

        if (this._kernel.canMoveTo(position.getX(), position.getY())) {

            if (this._player().isMoving()) {
                return ;
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
     * @returns {Position}
     * @private
     */
    _playerPosition()
    {
        return this._player().getCurrentPosition();
    }

    /**
     * @returns {Player}
     * @private
     */
    _player()
    {
        return this._kernel.player();
    }
}