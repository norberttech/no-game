'use strict';

import ws from 'ws';
import Broadcaster from './Broadcaster';
import Connection from './Network/Connection';
import MessageQueue from './MessageQueue';
import CharactersMessage from './Network/CharactersMessage';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';
import GameLoop from './GameLoop';
import Protocol from './Protocol';

export default class Server
{
    /**
     * @param {Kernel} kernel
     * @param {boolean} debug
     */
    constructor(kernel, debug = false)
    {
        Assert.instanceOf(kernel, Kernel);

        this._debug = debug;
        this._broadcaster = new Broadcaster();
        this._messageQueue = new MessageQueue();
        this._protocol = new Protocol(kernel, this._messageQueue, this._broadcaster);
        this._gameLoop = new GameLoop(1000 / 45, this.update.bind(this));
    }

    /**
     * @param {integer} port
     */
    listen(port = 8080)
    {
        Assert.integer(port);

        let onConnection = (socket) => {
            let connection = new Connection(socket, this._debug);

            connection.bindOnMessage(this.onMessage.bind(this));
            connection.bindOnClose(this.onClose.bind(this));

            this._broadcaster.addConnection(connection);
        };

        this._gameLoop.start();
        this._server = ws.createServer({ port: port, verifyClient: !this._debug}, onConnection);
        console.log(`Server is listening on port: ${port}`);
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