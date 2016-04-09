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

        let protocol = new Protocol(kernel, connection);

        if (this._stubConnection) {
            connection.setProtocol(protocol);
        }

        return protocol;
    }
}
