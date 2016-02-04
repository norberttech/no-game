'use strict';

import WebSocket from 'WebSocket';

export default class Client
{
    constructor()
    {
        let client = new WebSocket('ws://localhost:8080/', {
            protocolVersion: 8,
            origin: 'http://websocket.org'
        });

        client.on('open', () => {
            console.log('connected');

            client.send(Date.now().toString(), {mask: true});
        });
    }
}

new Client();