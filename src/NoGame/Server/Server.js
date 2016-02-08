'use strict';

import ws from 'ws';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';
import Player from './../Engine/Player';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';
import Connection from './Connection';

export default class Server
{
    /**
     * @param {Kernel} kernel
     * @param {boolean} debug
     */
    constructor(kernel, debug = false)
    {
        this._kernel = kernel;
        this._debug = debug;
        this._connections = new Map();
    }

    /**
     * @param {integer} port
     */
    listen(port = 8080)
    {
        Assert.integer(port);

        let onConnection = (socket) => {
            let connection = new Connection(socket);

            connection.bindOnMessage(this.onMessage.bind(this));
            connection.bindOnClose(this.onClose.bind(this));

            this._connections.set(connection.id(), connection);
            console.log(`New connection with id: ${connection.id()}`);
        };

        this._server = ws.createServer({ port: port, verifyClient: !this._debug}, onConnection);
    }

    /**
     * @param {string} message
     * @param {Connection} connection
     */
    onMessage(message, connection)
    {
        let packet = JSON.parse(message);

        switch (packet.name) {
            case 'login':
                let player = new Player(packet.data.username);
                this._kernel.login(player);
                connection.setPlayerId(player.id());
                connection.send(new LoginMessage(player));
                connection.send(new AreaMessage(this._kernel.playerArea(player.id())));
                break;
        }
    }

    /**
     * @param {Connection} connection
     */
    onClose(connection)
    {
        console.log(`Connection ${connection.id()} closed.`);

        this._connections.delete(connection.id());
    }
}