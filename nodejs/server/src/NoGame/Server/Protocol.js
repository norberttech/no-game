'use strict';

const Kernel = require('./../Engine/Kernel');
const Assert = require('assert-js');
const IncomeMessageQueue = require('./MessageQueue/IncomeQueue');
const Broadcaster = require('./Broadcaster');
const Logger = require('./../Common/Logger');

const Player = require('./../Engine/Player');
const Monster = require('./../Engine/Monster');
const Area = require('./../Engine/Map/Area');
const Position = require('./../Engine/Map/Area/Position');

const ClientMessages = require('./../Common/Network/ClientMessages');
const BatchMessage = require('./Network/BatchMessage');
const LoginMessage = require('./Network/LoginMessage');
const LogoutMessage = require('./Network/LogoutMessage');
const AreaMessage = require('./Network/AreaMessage');
const TileMessage = require('./Network/TileMessage');
const TilesMessage = require('./Network/TilesMessage');
const MoveMessage = require('./Network/MoveMessage');
const CharactersMessage = require('./Network/CharactersMessage');
const CharacterLogout = require('./Network/CharacterLogoutMessage');
const CharacterDiedMessage = require('./Network/CharacterDiedMessage');
const CharacterHealthMessage = require('./Network/CharacterHealthMessage');
const CharacterParryMessage = require('./Network/CharacterParryMessage');
const CharacterMoveMessage = require('./Network/CharacterMoveMessage');
const CharacterSayMessage = require('./Network/CharacterSayMessage');
const MonsterMoveMessage = require('./Network/MonsterMoveMessage');
const MonsterAttackMessage = require('./Network/MonsterAttackMessage');

class Protocol
{
    /**
     * @param {Kernel} kernel
     * @param {IncomeQueue} incomeMessages
     * @param {Broadcaster} broadcaster
     * @param {Logger} logger
     */
    constructor(kernel, incomeMessages, broadcaster, logger)
    {
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(incomeMessages, IncomeMessageQueue);
        Assert.instanceOf(broadcaster, Broadcaster);

        this._kernel = kernel;
        this._incomeMessages = incomeMessages;
        this._broadcaster = broadcaster;
        this._logger = logger;
    }

    /**
     * Parse messages from queue
     */
    parseMessages()
    {
        let messages = this._incomeMessages.flushMessages();

        for (let message of messages) {
            switch (message.packet.name) {
                case ClientMessages.LOGIN:
                    this._handleLogin(message.packet, message.connection);
                    break;
                case ClientMessages.MOVE:
                    this._handleMove(message.packet, message.connection);
                    break;
                case ClientMessages.MESSAGE:
                    this._handleMessage(message.packet, message.connection);
                    break;
                case ClientMessages.ATTACK_MONSTER:
                    this._handleAttackMonster(message.packet, message.connection);
                    break;
                default:
                    this._logger.error({msg: "Unhandled message", message: message});
                    break;
            }
        }
    }

    /**
     * @param {Connection} closedConnection
     */
    logout(closedConnection)
    {
        if (closedConnection.hasPlayerId) {
            // logout player
            this._kernel.logout(closedConnection.playerId);

            // update other players characters list
            this._broadcaster.sendToOtherConnectedClients(closedConnection, (connection) => {
                return new CharacterLogout(closedConnection.playerId);
            });
        }
    }

    /**
     * @param {Monster} monster
     */
    monsterSpawn(monster)
    {
        let area = this._kernel.area;
        let players = area.visiblePlayersFrom(monster.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            let messages = [];
            messages.push(new CharactersMessage(
                area.visiblePlayersFor(connection.playerId),
                area.visibleMonstersFor(connection.playerId)
            ));
            messages.push(new TileMessage(area.tile(monster.position)));

            return new BatchMessage(messages);
        });
    }

    /**
     * @param {Monster} monster
     * @param {Position} fromPosition
     */
    monsterMove(monster, fromPosition)
    {
        let area = this._kernel.area;
        let players = area.visiblePlayersFrom(monster.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            let messages = [];
            messages.push(new TileMessage(area.tile(fromPosition)));
            messages.push(new MonsterMoveMessage(monster, fromPosition));
            messages.push(new TileMessage(area.tile(monster.position)));

            return new BatchMessage(messages);
        });
    }

    /**
     * @param {Monster} monster
     * @param {Player} player
     */
    monsterStartAttack(monster, player)
    {
        this._broadcaster.sendToPlayer(player, (connection) => {
            return new MonsterAttackMessage(monster, true);
        });
    }

    /**
     * @param {Monster} monster
     * @param {Player} player
     */
    monsterStopAttack(monster, player)
    {
        this._broadcaster.sendToPlayer(player, (connection) => {
            return new MonsterAttackMessage(monster, false);
        });
    }

    /**
     * @param {Player} player
     * @param {int} damage
     */
    playerLossHealth(player, damage)
    {
        let players = this._kernel.area.visiblePlayersFrom(player.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            return new CharacterHealthMessage(player.id, player.health + damage, player.health);
        });
    }

    /**
     * @param {Monster} monster
     * @param {int} damage
     */
    monsterLossHealth(monster, damage)
    {
        let players = this._kernel.area.visiblePlayersFrom(monster.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            return new CharacterHealthMessage(monster.id, monster.health + damage, monster.health);
        });
    }

    /**
     * @param {Player} player
     */
    playerParry(player)
    {
        let players = this._kernel.area.visiblePlayersFrom(player.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            return new CharacterParryMessage(player.id);
        });
    }

    /**
     * @param {Monster} monster
     */
    monsterParry(monster)
    {
        let players = this._kernel.area.visiblePlayersFrom(monster.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            return new CharacterParryMessage(monster.id);
        });
    }

    /**
     * @param {Monster} monster
     */
    monsterDied(monster)
    {
        let players = this._kernel.area.visiblePlayersFrom(monster.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            return new CharacterDiedMessage(monster.id);
        });
    }


    /**
     * @param {Player} player
     */
    die(player)
    {
        Assert.instanceOf(player, Player);

        this._broadcaster.sendToPlayer(player, (connection) => {
            return new LogoutMessage("You died.");
        });

        let connection = this._broadcaster.getConnection(player.id);

        let players = this._kernel.area.visiblePlayersFrom(player.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            return new CharacterDiedMessage(player.id);
        });

        connection.removePlayer();
    }

    /**
     * @param {object} packet
     * @param {Connection} connection
     * @private
     */
    _handleLogin(packet, connection)
    {
        let player = new Player(packet.data.username, 100, 100, this._kernel.clock);
        this._kernel.login(player);
        let area = this._kernel.area;
        let messagesBatch = [];

        connection.setPlayerId(player.id);

        messagesBatch.push(new LoginMessage(player));
        messagesBatch.push(new AreaMessage(area.name, Area.visibleX, Area.visibleY));
        messagesBatch.push(new TilesMessage(
            area.visibleTilesFor(player.id)
        ));
        messagesBatch.push(new CharactersMessage(
            area.visiblePlayersFor(player.id),
            area.visibleMonstersFor(player.id)
        ));

        connection.send(new BatchMessage(messagesBatch));

        this._broadcaster.sendToPlayersInRange(area, player.id, (playerConnection) => {
            return new CharactersMessage(
                area.visiblePlayersFor(playerConnection.playerId),
                area.visibleMonstersFor(playerConnection.playerId)
            )
        });
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleMove(packet, currentConnection)
    {
        if (!currentConnection.hasPlayerId){
            currentConnection.disconnect();
            return ;
        }

        let area = this._kernel.area;
        let toPosition = new Position(packet.data.x, packet.data.y);
        let player = area.getPlayer(currentConnection.playerId);
        let fromPosition = player.position;

        try {
            this._kernel.movePlayer(currentConnection.playerId, toPosition);
        } catch (error) {
            currentConnection.send(new MoveMessage(player));
            return ;
        }

        let messages = [];
        messages.push(new MoveMessage(player));
        messages.push(new TilesMessage(
            area.visibleTilesFor(player.id)
        ));
        messages.push(new CharactersMessage(
            area.visiblePlayersFor(player.id),
            area.visibleMonstersFor(player.id)
        ));
        currentConnection.send(new BatchMessage(messages));
        // we need to send visible characters also because player may enter to map part where
        // players already stands

        this._broadcaster.sendToPlayersInRange(area, player.id, () => {
            let messages = [];
            messages.push(new CharacterMoveMessage(player, fromPosition));
            messages.push(new TileMessage(area.tile(fromPosition)));
            messages.push(new TileMessage(area.tile(toPosition)));

            return new BatchMessage(messages);
        });
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleMessage(packet, currentConnection)
    {
        if (!currentConnection.hasPlayerId){
            currentConnection.disconnect();
            return ;
        }

        let area = this._kernel.area;

        this._broadcaster.sendToPlayersInRange(
            area,
            currentConnection.playerId,
            () => {
                return new CharacterSayMessage(currentConnection.playerId, packet.data.message)
            }
        );
    }

    /**
     * @param {object} packet
     * @param {Connection} currentConnection
     * @private
     */
    _handleAttackMonster(packet, currentConnection)
    {
        if (!currentConnection.hasPlayerId){
            currentConnection.disconnect();
            return ;
        }

        this._kernel.playerAttack(currentConnection.playerId, packet.data.id);
    }
}

module.exports = Protocol;