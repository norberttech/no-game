'use strict';

import ws from 'ws';
import Broadcaster from './Broadcaster';
import Connection from './Network/Connection';
import IncomeMessageQueue from './MessageQueue/IncomeQueue';
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
        this._incomeMessageQueue = new IncomeMessageQueue();
        this._kernel = kernel;
        this._protocol = new Protocol(kernel, this._incomeMessageQueue, this._broadcaster, logger);
        this._logger = logger;
        this._gameLoop = new GameLoop(1000 / 45, this.update.bind(this));
        this._spawnTimer = 0;
        this._monsterThinkTimer = 0;
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
        this._incomeMessageQueue.addMessage(rawMessage, currentConnection);
    }

    /**
     * Game main loop
     */
    update(delta)
    {
        this._spawnTimer += delta;
        this._monsterThinkTimer += delta;
        this._protocol.parseMessages();

        if (this._spawnTimer > 5) {
            this._kernel.spawnMonsters((monster) => {
                this._protocol.monsterSpawn(monster);
            });
            this._spawnTimer = 0;
        }

        if (this._monsterThinkTimer > 1) {
            this._kernel.moveMonsters(
                (monster, oldPosition) => {
                    this._protocol.monsterMove(monster, oldPosition);
                },
                (monster, player) => {
                    this._protocol.monsterStopAttack(monster, player);
                }
            );
            this._monsterThinkTimer = 0;
        }

        this._kernel.monstersAttack((monster, player) => {
            this._protocol.monsterStartAttack(monster, player);
        });
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