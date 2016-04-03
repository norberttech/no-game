'use strict';

import Assert from 'assert-js';
import Protocol from './../Protocol';
import Kernel from './../Kernel';
import Connection from './../Network/Connection';
import Area from './../Map/Area';
import Tile from './../Map/Tile';
import Player from './../Player';
import Calculator from './../../Common/Area/Calculator';

const POS_X = 108;
const POS_Y = 106;

export default class ProtocolStub extends Protocol
{
    /**
     * @param {Kernel} kernel
     * @param {Connection} connection
     */
    constructor(kernel, connection)
    {
        super(kernel, connection);
    }

    /**
     * @param {string} username
     */
    login(username)
    {
        this._onLogin();

        // Login
        this._kernel.login(new Player(
            "111111111",
            username,
            100,
            100,
            POS_X,
            POS_Y
        ));

        this._isLoggedIn = true;
        // Login - End

        // Set Area
        this._kernel.setArea(new Area("offline"));
        this._kernel.setVisibleTiles(15, 11);
        // Set Area - End

        // Tiles
        let tiles = [];

        let centerPos = Calculator.centerPosition(15, 11);

        for (let x = POS_X - centerPos.x; x <= POS_X + centerPos.x; x++) {
            for (let y = POS_Y - centerPos.y; y <= POS_Y + centerPos.y; y++) {
                tiles.push(new Tile(x, y, true, [1], 0));
            }
        }

        this._kernel.area().setTiles(tiles);
        // Tiles - End

        // Characters
        this._kernel.setCharacters([]);
        // Cahracters - End
    }

    /**
     * @param {string} characterId
     */
    attack(characterId)
    {
    }

    /**
     * @param {string} message
     */
    say(message)
    {
    }

    /**
     * @param {Position} position
     */
    move(position)
    {
        if (this._kernel.player().isMoving()) {
            return ;
        }

        this._kernel.move(position.getX(), position.getY(), 500);

        let tiles = [];

        let centerPos = Calculator.centerPosition(15, 11);
        let playerPos = this._kernel.player().getCurrentPosition();

        for (let x = playerPos.getX() - centerPos.x; x <= playerPos.getX() + centerPos.x; x++) {
            for (let y = playerPos.getY() - centerPos.y; y <= playerPos.getY() + centerPos.y; y++) {
                tiles.push(new Tile(x, y, true, [1], 0));
            }
        }

        this._kernel.area().setTiles(tiles);
    }

    /**
     * @param {string} message
     * @param {Connection} connection
     */
    parseMessage(message, connection)
    {
        // there is no connection so there are no messages
    }

    /**
     * @param {function} callback
     */
    onLogout(callback)
    {
    }

    /**
     * @param {function} callback
     */
    onCharacterSay(callback)
    {
    }
}