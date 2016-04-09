'use strict';

import Assert from 'assert-js';
import Protocol from './Protocol';
import Connection from './Network/Connection';
import ConnectionStub from './Stub/ConnectionStub';

export default class ProtocolFactory
{
    /**
     * @param {boolean} [stubConnection]
     */
    constructor(stubConnection = false)
    {
        Assert.boolean(stubConnection);

        this._stubConnection = stubConnection;
    }

    /**
     * @param {Kernel} kernel
     * @returns {Protocol}
     */
    create(kernel)
    {
        let connection = (this._stubConnection)
            ? new ConnectionStub()
            : new Connection();

        return new Protocol(kernel, connection);
    }
}
