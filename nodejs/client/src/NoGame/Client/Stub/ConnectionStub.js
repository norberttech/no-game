'use strict';

const Connection = require('./../Network/Connection');
const ServerMessages = require('./../../Common/ServerMessages');
const AreaCalculator = require('./../../Common/AreaCalculator');
const UUID = require('uuid');

const PLAYER_POS_X = 108;
const PLAYER_POS_Y = 106;
const MONSTER_ID = UUID.v4();

class ConnectionStub extends Connection
{
    constructor()
    {
        super();
        this._onMessage = null;
        this._protocol = null;
    }

    setProtocol(protocol)
    {
        this._protocol = protocol;
    }

    /**
     * @param {string} serverAddress
     * @param {function} onOpen
     * @param {function} onMessage
     * @param {function} onError
     */
    open(serverAddress, onOpen, onMessage, onError)
    {
        onOpen(this);
        this._onMessage = onMessage;
    }

    /**
     * @param {function} callback
     */
    bindOnClose(callback)
    {
    }

    /**
     * @param {Message} message
     * @param callback
     */
    send(message, callback = () => {})
    {
        let centerPosition = AreaCalculator.centerPosition(17, 13);

        switch (message.constructor.name) {
            case 'LoginMessage':
                this._onMessage(this._composeLoginMessage(message.data.login, 1000, 100, PLAYER_POS_X, PLAYER_POS_Y));
                this._onMessage(this._composeAreaMessage());
                this._onMessage(this._composeTilesMessage(
                    PLAYER_POS_X - centerPosition.x,
                    PLAYER_POS_X + centerPosition.x,
                    PLAYER_POS_Y - centerPosition.y,
                    PLAYER_POS_Y + centerPosition.y
                ));
                this._onMessage(this._composeCharactersMessage());
                break;
            case 'MoveMessage':
                this._onMessage(this._composeTilesMessage(
                    message.data.x - centerPosition.x,
                    message.data.x + centerPosition.x,
                    message.data.y - centerPosition.y,
                    message.data.y + centerPosition.y
                ));
                this._onMessage(this._composeCharactersMessage());
                break;
        }
    }

    /**
     * @param {string} name
     * @param {int} experience
     * @param {int} health
     * @param {int} x
     * @param {int} y
     * @returns {object}
     * @private
     */
    _composeLoginMessage(name, experience, health, x, y)
    {
        let message = {
            name: ServerMessages.LOGIN,
            data: {
                id: UUID.v4(),
                experience: experience,
                name: name,
                health: health,
                maxHealth: health,
                position: {
                    x: x,
                    y: y
                }
            }
        };

        return {data: JSON.stringify(message)};
    }

    /**
     * @returns {object}
     * @private
     */
    _composeAreaMessage()
    {
        let message = {
            name: ServerMessages.AREA,
            data: {
                name: 'offlinea',
                visibleTiles: {
                    x: 17,
                    y: 13
                }
            }
        };

        return {data: JSON.stringify(message)};
    }

    /**
     * @param {int} startX
     * @param {int} endX
     * @param {int} startY
     * @param {int} endY
     * @private
     */
    _composeTilesMessage(startX, endX, startY, endY)
    {
        let message = {
            name: ServerMessages.TILES,
            data: {
                tiles: []
            }
        };

        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                let stack = [];
                let monsters = [];

                if (y === PLAYER_POS_Y - 1) {
                    stack = [426];
                }

                if (x === PLAYER_POS_X - 4 && y === PLAYER_POS_Y) {
                    monsters = [MONSTER_ID];
                }

                message.data.tiles.push({
                    x: x,
                    y: y,
                    canWalkOn: true,
                    ground: 1,
                    stack: stack,
                    monster: monsters,
                    players: [],
                    moveSpeedModifier: 0
                });
            }
        }

        return {data: JSON.stringify(message)};
    }

    _composeCharactersMessage()
    {
        let message = {
            name: ServerMessages.CHARACTERS,
            data: {
                characters: [
                    {
                        id: MONSTER_ID,
                        type: 2,
                        name: "Monster",
                        health: 100,
                        maxHealth: 100,
                        position: {
                            x: PLAYER_POS_X - 4,
                            y: PLAYER_POS_Y
                        }
                    }
                ]
            }
        };

        return {data: JSON.stringify(message)};
    }
}

module.exports = ConnectionStub;