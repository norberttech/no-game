'use strict';

import Assert from './../../../JSAssert/Assert';
import Connection from './../Network/Connection';

export default class Message
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