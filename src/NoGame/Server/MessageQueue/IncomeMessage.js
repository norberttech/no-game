'use strict';

import Assert from 'assert-js';
import Connection from './../Network/Connection';

export default class IncomeMessage
{
    /**
     * @param {object} packet
     * @param {Connection} connection
     */
    constructor(packet, connection)
    {
        Assert.object(packet);
        Assert.instanceOf(connection, Connection);

        this._packet = packet;
        this._connection = connection;
    }

    /**
     * @returns {object}
     */
    getPacket()
    {
        return this._packet;
    }

    /**
     * @returns {Connection}
     */
    getConnection()
    {
        return this._connection;
    }
}