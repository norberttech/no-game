'use strict';

const Assert = require('assert-js');
const Connection = require('./../Network/Connection');

class IncomeMessage
{
    /**
     * @param {object} packet
     * @param {Connection} connection
     */
    constructor(packet, connection)
    {
        Assert.instanceOf(connection, Connection);

        this._packet = packet;
        this._connection = connection;
    }

    /**
     * @returns {object}
     */
    get packet()
    {
        return this._packet;
    }

    /**
     * @returns {Connection}
     */
    get connection()
    {
        return this._connection;
    }
}

module.exports = IncomeMessage;