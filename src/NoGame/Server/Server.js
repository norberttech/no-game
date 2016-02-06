'use strict';

import ws from 'ws';
import Assert from './../../JSAssert/Assert';
import Kernel from './../Engine/Kernel';

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

        let onConnection = (socket) => {
            console.log('connected client');

            socket.on('message', (message) => {
                console.log('received: %s', message);
            });

            socket.on('close', () => {
                console.log('connection closed');
            });
        };

        this._server = ws.createServer({ port: port, verifyClient: !this._debug}, onConnection);
    }
}