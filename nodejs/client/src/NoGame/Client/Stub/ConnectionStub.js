'use strict';

import Connection from './../Network/Connection';
import {NetworkMessage} from 'nogame-common';
import {ClientMessages} from 'nogame-common';
import {ServerMessages} from 'nogame-common';
import {AreaCalculator} from 'nogame-common';
import UUID from 'uuid';

const PLAYER_POS_X = 108;
const PLAYER_POS_Y = 106;

export default class ConnectionStub extends Connection
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
     */
    open(serverAddress, onOpen, onMessage)
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
        let centerPosition = AreaCalculator.centerPosition(15, 11);

        switch (message.constructor.name) {
            case 'LoginMessage':
                this._onMessage(this._composeLoginMessage(message.data.username, 100, PLAYER_POS_X, PLAYER_POS_Y));
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
     * @param {int} health
     * @param {int} x
     * @param {int} y
     * @returns {object}
     * @private
     */
    _composeLoginMessage(name, health, x, y)
    {
        let message = {
            name: ServerMessages.LOGIN,
            data: {
                id: UUID.v4(),
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
                    x: 15,
                    y: 11
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
                message.data.tiles.push({
                    x: x,
                    y: y,
                    canWalkOn: true,
                    stack: [
                        1
                    ],
                    monster: [],
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
                characters: []
            }
        };

        return {data: JSON.stringify(message)};
    }
}