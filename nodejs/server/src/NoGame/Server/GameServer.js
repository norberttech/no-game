'use strict';

const HttpServer = require('http');
const WebsocketServer = require('ws').Server;
const Broadcaster = require('./Broadcaster');
const Connection = require('./Network/Connection');
const IncomeQueue = require('./MessageQueue/IncomeQueue');
const Assert = require('assert-js');
const Kernel = require('./../Engine/Kernel');
const GameLoop = require('./GameLoop');
const Protocol = require('./Protocol');
const Logger = require('./../Common/Logger');

class GameServer
{
    /**
     * @param {Kernel} kernel
     * @param {Protocol} protocol
     * @param {Logger} logger
     * @param {GameLoop} loop
     * @param {Broadcaster} broadcaster
     * @param {IncomeQueue} incomeMessageQueue
     */
    constructor(kernel, protocol, logger, loop, broadcaster, incomeMessageQueue)
    {
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(protocol, Protocol);
        Assert.instanceOf(loop, GameLoop);
        Assert.instanceOf(logger, Logger);
        Assert.instanceOf(broadcaster, Broadcaster);
        Assert.instanceOf(incomeMessageQueue, IncomeQueue);

        this._broadcaster = broadcaster;
        this._incomeMessageQueue = incomeMessageQueue;
        this._kernel = kernel;
        this._protocol = protocol;
        this._logger = logger;
        this._gameLoop = loop;
        this._spawnTimer = 0;
        this._monsterThinkTimer = 0;
        this._isTerminated = false;
        this._wsServer = null;
        this._httpServer = null;
    }

    /**
     * @param {HttpServer} httpServer
     * @param {int} [port]
     * @param {function} [callback]
     */
    listen(httpServer, port = 8080, callback = () => {})
    {
        Assert.integer(port);
        Assert.isFunction(callback);

        this._gameLoop.start(1000 / 45, this.update.bind(this));

        this._httpServer = httpServer;
        this._wsServer = new WebsocketServer({ server: this._httpServer });
        this._wsServer.on('connection', this.onConnection.bind(this));

        this._httpServer.listen(port, () => {
            this._logger.info(`Server is listening on port: ${port}`);
            callback();
        });
    }

    onConnection(socket) {
        let connection = new Connection(socket, this._logger);

        connection.bindOnMessage(this.onMessage.bind(this));
        connection.bindOnClose(this.onClose.bind(this));

        this._broadcaster.addConnection(connection);
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

        this._kernel.chooseMonstersAttackTarget((monster, player) => {
            this._protocol.monsterStartAttack(monster, player);
        });

        this._kernel.runMonstersAttackTurn(
            (player, damage) => {
                this._protocol.playerLossHealth(player, damage);
            },
            (player) => {
                this._protocol.playerParry(player);
            },
            (player) => {
                this._protocol.die(player);
            }
        );

        this._kernel.runPlayersAttack(
            (monster, damage) => {
                this._protocol.monsterLossHealth(monster, damage);
            },
            (monster) => {
                this._protocol.monsterParry(monster);
            },
            (monster) => {
                this._protocol.monsterDied(monster);
            }
        );
    }

    /**
     * @param {Connection} closedConnection
     */
    onClose(closedConnection)
    {
        this._protocol.logout(closedConnection);

        this._broadcaster.removeConnection(closedConnection.id);
    }

    /**
     * @returns {boolean}
     */
    get isTerminated()
    {
        return this._isTerminated;
    }

    /**
     * @param {function} [callback]
     * @param {int} terminationTimeout
     */
    terminate(callback = () => {}, terminationTimeout = 500)
    {
        Assert.isFunction(callback);
        Assert.integer(terminationTimeout);

        this._isTerminated = true;
        this._logger.info("Server Terminate: Stopping game loop.");
        this._gameLoop.stop();
        this._logger.info("Server Terminate: Saving Characters.");
        this._logger.info("Server Terminate: Closing WebServer.");

        setTimeout(() => {
            this._wsServer.close(() => {
                this._logger.info("Websocket Server Terminate: Terminated.");
                this._httpServer.close(() => {
                    this._logger.info("Http Server Terminate: Terminated.");
                    callback();
                });
            });
        }, terminationTimeout);
    }
}

module.exports = GameServer;