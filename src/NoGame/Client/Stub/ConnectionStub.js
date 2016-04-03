'use strict';

import Assert from 'assert-js';
import Message from '../../Common/Network/Message';
import Connection from './../Network/Connection';

export default class ConnectionStub extends Connection
{
    /**
     * @param {string} serverAddress
     * @param {function} onOpen
     * @param {function} onMessage
     */
    open(serverAddress, onOpen, onMessage)
    {
        onOpen(this);
    }

    /**
     * @param {function} callback
     */
    bindOnClose(callback)
    {
    }

    /**
     * @param {Message} message
     * @param callback
     */
    send(message, callback = () => {})
    {
    }
}