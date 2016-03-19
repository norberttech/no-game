'use strict';

import Kernel from './../Engine/Kernel';
import Assert from 'assert-js';
import MessageQueue from './MessageQueue';
import Broadcaster from './Broadcaster';
import Logger from './../Common/Logger';

import Player from './../Engine/Player';
import Position from './../Engine/Map/Area/Position';

import ClientMessages from './../Common/Network/ClientMessages'
import BatchMessage from './Network/BatchMessage';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';
import TilesMessage from './Network/TilesMessage';
import MoveMessage from './Network/MoveMessage';
import CharactersMessage from './Network/CharactersMessage';
import CharacterMoveMessage from './Network/CharacterMoveMessage';
import CharacterSayMessage from './Network/CharacterSayMessage';

/**
 * Client displays x: 15 and y: 11 but it keeps 2 tiles hidden.
 *
 * @type {{x: number, y: number}}
 */
const VISIBLE_TILES = {x: 17, y: 13};

export default class Protocol
{
    /**
     * @param {Kernel} kernel
     * @param {MessageQueue} messages
     * @param {Broadcaster} broadcaster
     * @param {Logger} logger
     */
    constructor(kernel, messages, broadcaster, logger)
    {
        Assert.instanceOf(kernel, Kernel);
        Assert.instanceOf(messages, MessageQueue);
        Assert.instanceOf(broadcaster, Broadcaster);

        this._kernel = kernel;
        this._messages = messages;
        this._broadcaster = broadcaster;
        this._logger = logger;
    }

    /**
     * Parse messages from queue
     */
    parseMessages()
    {
        let messages = this._messages.flushMessages();

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
                        .visiblePlayersFor(connection.playerId(), VISIBLE_TILES.x, VISIBLE_TILES.y)
                )
            });
        }

    }
    /**
     * @param {object} packet
     * @param {Connection} connection
     * @private
     */
    _handleLogin(packet, connection)
    {
        let player = new Player(packet.data.username);
        this._kernel.login(player);
        let area = this._kernel.getArea();
        let messagesBatch = [];

        connection.setPlayerId(player.id());

        messagesBatch.push(new LoginMessage(player));
        messagesBatch.push(new AreaMessage(area.name(), VISIBLE_TILES.x, VISIBLE_TILES.y));
        messagesBatch.push(new TilesMessage(
            area.visibleTilesFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y),
            area.visiblePlayersFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y)
        ));

        connection.send(new BatchMessage(messagesBatch));

        this._broadcaster.sendToPlayersInRange(area, player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y, (playerConnection) => {
            return new CharactersMessage(
                area.visiblePlayersFor(playerConnection.playerId(), VISIBLE_TILES.x, VISIBLE_TILES.y)
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
        let fromPosition = player.currentPosition();

        if (player.isMoving()) {
            this._logger.error({msg: 'still moving', player: player});
            currentConnection.send(new MoveMessage(player));
            return;
        }

        if (player.currentPosition().isEqualTo(toPosition)) {
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
            area.visibleTilesFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y),
            area.visiblePlayersFor(player.id(), VISIBLE_TILES.x, VISIBLE_TILES.y)
        ));
        currentConnection.send(new BatchMessage(messages));
        // we need to send visible characters also because player may enter to map part where
        // players already stands

        this._broadcaster.sendToPlayersInRange(area, player.id(), VISIBLE_TILES.x + 2, VISIBLE_TILES.y + 2, () => {
            return new CharacterMoveMessage(player, fromPosition);
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
            VISIBLE_TILES.x + 2,
            VISIBLE_TILES.y + 2,
            () => {
                return new CharacterSayMessage(currentConnection.playerId(), packet.data.message)
            }
        );
    }
}