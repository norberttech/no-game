'use strict';

import ws from 'ws';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';
import Player from './../Engine/Player';
import LoginMessage from './Network/LoginMessage';
import AreaMessage from './Network/AreaMessage';

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
    }

    /**
     * @param {integer} port
     */
    listen(port = 8080)
    {
        Assert.integer(port);

        let onConnection = (connection) => {
            // Add connection to Server connections list
            connection.on('message', (message) => {
                let packet = JSON.parse(message);

                switch (packet.name) {
                    case 'login':
                        let player = new Player(packet.data.username);
                        this._kernel.login(player);
                        connection.send(new LoginMessage(player).toString());
                        connection.send(new AreaMessage(this._kernel.playerArea(player.id())).toString());
                        break;
                }

            });

            connection.on('close', () => {
                console.log('connection closed');
            });
        };

        this._server = ws.createServer({ port: port, verifyClient: !this._debug}, onConnection);
    }
}