'use strict';

const ServerMessages = require('./../../../src/NoGame/Common/ServerMessages');
const MessageParser = require('./MessageParser');
const MoveMessageAssertion = require('./Message/MoveMessageAssertion');

class MessageAssert
{
    static messageString(message)
    {
        let msg = MessageParser.parse(message);

        if (!msg.hasOwnProperty('name')) {
            throw Error('Message require name property');
        }

        if (!msg.hasOwnProperty('data')) {
            throw Error('Message require data property');
        }
    }

    static messageObject(message)
    {
        if (!message.hasOwnProperty('name')) {
            throw Error('Message require name property');
        }

        if (!message.hasOwnProperty('data')) {
            throw Error('Message require data property');
        }
    }

    static batchString(message)
    {
        this.messageString(message);

        let msg = MessageParser.parse(message);

        if (msg.name !== ServerMessages.BATCH_MESSAGE) {
            throw Error(`${ServerMessages.BATCH_MESSAGE} expected but got ${msg.name}`);
        }
    }

    static characterListObject(message)
    {
        this.messageObject(message);

        if (message.name !== ServerMessages.LOGIN_CHARACTER_LIST) {
            throw Error(`${ServerMessages.LOGIN_CHARACTER_LIST} expected but got ${message.name}`);
        }
    }

    static characterListString(message)
    {
        this.messageString(message);

        let msg = MessageParser.parse(message);

        if (msg.name !== ServerMessages.LOGIN_CHARACTER_LIST) {
            throw Error(`${ServerMessages.LOGIN_CHARACTER_LIST} expected but got ${msg.name}`);
        }
    }

    static loginAccountNotFoundString(message)
    {
        this.messageString(message);

        let msg = MessageParser.parse(message);

        if (msg.name !== ServerMessages.LOGIN_ACCOUNT_NOT_FOUND) {
            throw Error(`${ServerMessages.LOGIN_ACCOUNT_NOT_FOUND} expected but got ${msg.name}`);
        }
    }

    static areaObject(message)
    {
        this.messageObject(message);

        if (message.name !== ServerMessages.AREA) {
            throw Error(`${ServerMessages.AREA} expected but got ${message.name}`);
        }
    }

    static loginObject(message)
    {
        this.messageObject(message);

        if (message.name !== ServerMessages.LOGIN) {
            throw Error(`${ServerMessages.LOGIN} expected but got ${message.name}`);
        }
    }

    static tilesObject(message)
    {
        this.messageObject(message);

        if (message.name !== ServerMessages.TILES) {
            throw Error(`${ServerMessages.TILES} expected but got ${message.name}`);
        }
    }

    static charactersObject(message)
    {
        this.messageObject(message);

        if (message.name !== ServerMessages.CHARACTERS) {
            throw Error(`${ServerMessages.CHARACTERS} expected but got ${message.name}`);
        }
    }

    static charactersString(message)
    {
        this.messageString(message);

        let msg = MessageParser.parse(message);

        if (msg.name !== ServerMessages.CHARACTERS) {
            throw Error(`${ServerMessages.CHARACTERS} expected but got ${msg.name}`);
        }
    }

    static characterLogoutString(message)
    {
        this.messageString(message);

        let msg = MessageParser.parse(message);

        if (msg.name !== ServerMessages.CHARACTER_LOGOUT) {
            throw Error(`${ServerMessages.CHARACTER_LOGOUT} expected but got ${msg.name}`);
        }
    }

    /**
     * @param {object} message
     * @returns {MoveMessageAssertion}
     */
    static moveString(message)
    {
        this.messageString(message);

        let msg = MessageParser.parse(message);

        if (msg.name !== ServerMessages.PLAYER_MOVE) {
            throw Error(`${ServerMessages.PLAYER_MOVE} expected but got ${msg.name}`);
        }

        return new MoveMessageAssertion(msg);
    }

    /**
     * @param {object} message
     * @returns {MoveMessageAssertion}
     */
    static moveObject(message)
    {
        this.messageObject(message);

        if (message.name !== ServerMessages.PLAYER_MOVE) {
            throw Error(`${ServerMessages.PLAYER_MOVE} expected but got ${message.name}`);
        }

        return new MoveMessageAssertion(message);
    }
}

module.exports = MessageAssert;