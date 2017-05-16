'use strict';

const Assert = require('assert-js');
const ClientMessages = require('nogame-common').ClientMessages;

class MessageFactory
{
    /**
     * @param {string} login
     * @param {string} pass
     */
    static login(login, pass)
    {
        Assert.string(login);
        Assert.string(pass);

        return JSON.stringify({name:ClientMessages.LOGIN,data:{login:login,password:pass}});
    }

    /**
     * @param {string} characterId
     */
    static loginCharacter(characterId)
    {
        Assert.string(characterId);

        return JSON.stringify({name:ClientMessages.LOGIN_CHARACTER,data:{characterId:characterId}});
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