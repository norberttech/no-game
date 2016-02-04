'use strict';

import WebSocketServer from 'WebSocketServer';

export default class Server
{
    constructor(kernel)
    {
        this._kernel = kernel;
        this._server = new WebSocketServer({ port: 8080, verifyClient: false});
    }

    listen()
    {
        this._server.on('connection', (ws) => {
            console.log('connected client');

            ws.on('message', (message) => {
                console.log('received: %s', message);
            });

            ws.on('close', () => {
                console.log('connection closed');
            })
        });
    }
}