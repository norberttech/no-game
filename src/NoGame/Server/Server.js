'use strict';

import ws from 'ws';
import Broadcaster from './Broadcaster';
import Connection from './Network/Connection';
import MessageQueue from './MessageQueue';
import CharactersMessage from './Network/CharactersMessage';
import Assert from 'assert-js';
import Kernel from './../Engine/Kernel';
import GameLoop from './GameLoop';
import Protocol from './Protocol';
import Logger from './../Common/Logger';

export default class Server
{
    /**
     * @param {Kernel} kernel
     * @param {Logger} logger
     */
    constructor(kernel, logger)
    {
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(logger, Logger);

        this._broadcaster = new Broadcaster();
        this._messageQueue = new MessageQueue();
        this._protocol = new Protocol(kernel, this._messageQueue, this._broadcaster, logger);
        this._logger = logger;
        this._gameLoop = new GameLoop(1000 / 45, this.update.bind(this));
    }

    /**
     * @param {integer} port
     */
    listen(port = 8080)
    {
        Assert.integer(port);

        let onConnection = (socket) => {
            let connection = new Connection(socket, this._logger);

            connection.bindOnMessage(this.onMessage.bind(this));
            connection.bindOnClose(this.onClose.bind(this));

            this._broadcaster.addConnection(connection);
        };

        this._gameLoop.start();
        this._server = ws.createServer({
            port: port,
            verifyClient: false
        }, onConnection);

        this._logger.info(`Server is listening on port: ${port}`);
    }

    /**
     * @param {string} rawMessage
     * @param {Connection} currentConnection
     */
    onMessage(rawMessage, currentConnection)
    {
        this._messageQueue.addMessage(rawMessage, currentConnection);
    }

    /**
     * Game main loop
     */
    update()
    {
        this._protocol.parseMessages();
    }

    /**
     * @param {Connection} closedConnection
     */
    onClose(closedConnection)
    {
        this._protocol.logout(closedConnection);

        this._broadcaster.removeConnection(closedConnection.id());
    }
}