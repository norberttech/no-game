'use strict';

import Kernel from './../Engine/Kernel';
import Assert from 'assert-js';
import IncomeMessageQueue from './MessageQueue/IncomeQueue';
import Broadcaster from './Broadcaster';
import Logger from './../Common/Logger';

import Player from './../Engine/Player';
import Monster from './../Engine/Monster';
import Area from './../Engine/Map/Area';
import Position from './../Engine/Map/Area/Position';

import ClientMessages from './../Common/Network/ClientMessages'
import BatchMessage from './Network/BatchMessage';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';
import TileMessage from './Network/TileMessage';
import TilesMessage from './Network/TilesMessage';
import MoveMessage from './Network/MoveMessage';
import CharactersMessage from './Network/CharactersMessage';
import CharacterMoveMessage from './Network/CharacterMoveMessage';
import CharacterSayMessage from './Network/CharacterSayMessage';
import MonsterMoveMessage from './Network/MonsterMoveMessage';
import MonsterAttackMessage from './Network/MonsterAttackMessage';

export default class Protocol
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
            let packet = message.getPacket();

            switch (packet.name) {
                case ClientMessages.LOGIN:
                    this._handleLogin(packet, message.getConnection());
                    break;
                case ClientMessages.MOVE:
                    this._handleMove(packet, message.getConnection());
                    break;
                case ClientMessages.MESSAGE:
                    this._handleMessage(packet, message.getConnection());
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
        if (closedConnection.hasPlayerId()) {
            // logout player
            this._kernel.logout(closedConnection.playerId());

            // update other players characters list
            this._broadcaster.sendToOtherConnectedClients(closedConnection, (connection) => {
                return new CharactersMessage(
                    this._kernel.getArea()
                        .visiblePlayersFor(connection.playerId()),
                    this._kernel.getArea()
                        .visibleMonstersFor(connection.playerId())
                )
            });
        }

    }

    /**
     * @param {Monster} monster
     */
    monsterSpawn(monster)
    {
        let area = this._kernel.getArea();
        let players = area.visiblePlayersFrom(monster.position);

        this._broadcaster.sendToPlayers(players, (connection) => {
            let messages = [];
            messages.push(new CharactersMessage(
                area.visiblePlayersFor(connection.playerId()),
                area.visibleMonstersFor(connection.playerId())
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
        let area = this._kernel.getArea();
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
     * @param {object} packet
     * @param {Connection} connection
     * @private
     */
    _handleLogin(packet, connection)
    {
        let player = new Player(packet.data.username, 100, 100);
        this._kernel.login(player);
        let area = this._kernel.getArea();
        let messagesBatch = [];

        connection.setPlayerId(player.id());

        messagesBatch.push(new LoginMessage(player));
        messagesBatch.push(new AreaMessage(area.name, Area.visibleX, Area.visibleY));
        messagesBatch.push(new TilesMessage(
            area.visibleTilesFor(player.id())
        ));

        messagesBatch.push(new CharactersMessage(
            area.visiblePlayersFor(player.id()),
            area.visibleMonstersFor(player.id())
        ));

        connection.send(new BatchMessage(messagesBatch));

        this._broadcaster.sendToPlayersInRange(area, player.id(), (playerConnection) => {
            return new CharactersMessage(
                area.visiblePlayersFor(playerConnection.playerId()),
                area.visibleMonstersFor(playerConnection.playerId())
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
        let area = this._kernel.getArea();
        let toPosition = new Position(packet.data.x, packet.data.y);
        let player = area.player(currentConnection.playerId());
        let fromPosition = player.position;

        if (player.isMoving()) {
            this._logger.error({msg: 'still moving', player: player});
            currentConnection.send(new MoveMessage(player));
            return;
        }

        if (player.position.isEqualTo(toPosition)) {
            this._logger.error({msg: 'already on position', player: player});
            currentConnection.send(new MoveMessage(player));
            return ;
        }

        try {
            area.movePlayerTo(currentConnection.playerId(), toPosition);
        } catch (error) {
            currentConnection.send(new MoveMessage(player));
            return ;
        }

        let messages = [];
        messages.push(new MoveMessage(player));
        messages.push(new TilesMessage(
            area.visibleTilesFor(player.id())
        ));
        messages.push(new CharactersMessage(
            area.visiblePlayersFor(player.id()),
            area.visibleMonstersFor(player.id())
        ));
        currentConnection.send(new BatchMessage(messages));
        // we need to send visible characters also because player may enter to map part where
        // players already stands

        this._broadcaster.sendToPlayersInRange(area, player.id(), () => {
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
        let area = this._kernel.getArea();

        this._broadcaster.sendToPlayersInRange(
            area,
            currentConnection.playerId(),
            () => {
                return new CharacterSayMessage(currentConnection.playerId(), packet.data.message)
            }
        );
    }
}