'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';

export default class Client
{
    /**
     * @param {string} serverAddress
     * @param {Engine} gfxEngine
     */
    constructor(serverAddress, gfxEngine)
    {
        Assert.string(serverAddress);
        Assert.instanceOf(gfxEngine, Engine);

        this._serverAddress = serverAddress;
        this._gfxEngine = gfxEngine;
    }

    connect()
    {
        this._connection = new WebSocket(
            this._serverAddress,
            "ws"
        );
        this._connection.onopen = () => {
            this._gfxEngine.draw();
            this._connection.send({test: 'test'});
        };
    }
}