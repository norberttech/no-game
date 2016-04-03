'use strict';

import Assert from 'assert-js';
import Protocol from './Protocol';
import Connection from './Network/Connection';
import ProtocolStub from './Stub/ProtocolStub';
import ConnectionStub from './Stub/ConnectionStub';

export default class ProtocolFactory
{
    /**
     * @param {boolean} [stub]
     */
    constructor(stub = false)
    {
        Assert.boolean(stub);

        this._stub = stub;
    }

    /**
     * @param {Kernel} kernel
     * @returns {Protocol}
     */
    create(kernel)
    {
        let connection = (this._stub)
            ? new ConnectionStub()
            : new Connection();

        if (this._stub) {
            return new ProtocolStub(kernel, connection);
        }

        return new Protocol(kernel, connection);
    }
}
