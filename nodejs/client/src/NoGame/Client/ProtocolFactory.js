'use strict';

const Assert = require('assert-js');
const ExperienceCalculator = require('./../Common/ExperienceCalculator');
const Protocol = require('./Protocol');
const Connection = require('./Network/Connection');
const ConnectionStub = require('./Stub/ConnectionStub');
const UserInterface = require('./UserInterface');

class ProtocolFactory
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

        let protocol = new Protocol(kernel, this._ui, connection, new ExperienceCalculator());

        if (this._stubConnection) {
            connection.setProtocol(protocol);
        }

        return protocol;
    }
}

module.exports = ProtocolFactory;