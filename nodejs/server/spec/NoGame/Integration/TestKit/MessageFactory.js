'use strict';

const Assert = require('assert-js');
const ClientMessages = require('./../../../../src/NoGame/Common/Network/ClientMessages');

class MessageFactory
{
    /**
     * @param {string} username
     */
    static authenticate(username)
    {
        Assert.string(username);

        return JSON.stringify({name:ClientMessages.LOGIN,data:{username:username}});
    }

    /**
     * @param {int} x
     * @param {int} y
     */
    static move(x, y)
    {
        Assert.integer(x);
        Assert.integer(y);

        return JSON.stringify({name:ClientMessages.MOVE,data:{x:x,y:y}});
    }
}

module.exports = MessageFactory;