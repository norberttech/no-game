'use strict';

import Assert from 'assert-js';
import Kernel from './Kernel';
import Protocol from './Protocol';
import Position from './Position';
import Directions from './Directions';
import Connection from './Network/Connection';
import KeyBoard from './Input/KeyBoard';
import Mouse from './Input/Mouse';
import Keys from './Input/Keys';
import ProtocolFactory from './ProtocolFactory';

export default class Client
{
    /**
     * @param {string} serverAddress
     * @param {Kernel} kernel
     * @param {KeyBoard} keyboard
     * @param {Mouse} mouse
     * @param {ProtocolFactory} protocolFactory
     */
    constructor(serverAddress, kernel, keyboard, mouse, protocolFactory)
    {
        Assert.string(serverAddress);
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(keyboard, KeyBoard);
        Assert.instanceOf(mouse, Mouse);
        Assert.instanceOf(protocolFactory, ProtocolFactory);

        this._kernel = kernel;
        this._mouse = mouse;
        this._serverAddress = serverAddress;
        this._isLoggedIn = false;
        this._keyboard = keyboard;
        this._protocol = null;
        this._protocolFactory = protocolFactory;

        this._kernel.boot();

        setInterval(this._gameLoop.bind(this), 1000 / 60);
        mouse.onClick(this._onMouseClick.bind(this));
    }

    /**
     * @returns {Protocol}
     */
    get protocol()
    {
        if (this._protocol === null) {
            throw `Client not connected, protocol was not created.`;
        }

        return this._protocol;
    }

    /**
     * @returns {Promise}
     */
    connect()
    {
        return new Promise((resolve, reject) => {
            this._protocol = this._protocolFactory.create(this._kernel);

            this._protocol.connection.open(
                this._serverAddress,
                () => {
                    resolve(this);
                },
                this._onMessage.bind(this),
                () => {
                    reject(this);
                }
            );
        });
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

        this._protocol.connection.bindOnClose(() => {
            callback(this);
            this._isLoggedIn = false;
        });
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
            if (character.position.isEqual(mouseAbsolutePosition) && character.isMonster) {
                this._protocol.attack(character.id);
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

        if (this._kernel.hasWalkPath) {
            if (this._kernel.player.isMoving) {
                return ;
            }

            this._move(this._kernel.nextWalkPathPosition);
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

        this._protocol.move(position);
    }


    /**
     * @returns {Position}
     * @private
     */
    _playerPosition()
    {
        return this._kernel.player.position;
    }
}