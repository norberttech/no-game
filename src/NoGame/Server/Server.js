'use strict';

import ws from 'ws';

export default class Server
{
    constructor(kernel)
    {
        this._kernel = kernel;
        this._server = ws.createServer({ port: 8080, verifyClient: false});
        console.log('start listening on 8080');
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