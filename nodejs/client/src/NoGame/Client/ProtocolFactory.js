'use strict';

import Assert from 'assert-js';
import Protocol from './Protocol';
import Connection from './Network/Connection';
import ConnectionStub from './Stub/ConnectionStub';
import UserInterface from './UserInterface';

export default class ProtocolFactory
{
    /**
     * @param {UserInterface} ui
     * @param {boolean} [stubConnection]
     */
    constructor(ui, stubConnection = false)
    {
        Assert.boolean(stubConnection);
        Assert.instanceOf(ui, UserInterface);

        this._ui = ui;
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

        let protocol = new Protocol(kernel, this._ui, connection);

        if (this._stubConnection) {
            connection.setProtocol(protocol);
        }

        return protocol;
    }
}
