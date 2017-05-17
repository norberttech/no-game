'use strict';

const Assert = require('assert-js');

class Accounts
{
    /**
     * @param {string} login
     * @param {string} rawPassword
     * @returns {Promise}
     */
    getAccount(login, rawPassword)
    {
        throw new Error('Method not implemented');
    }
}

module.exports = Accounts;