'use strict';

const Assert = require('assert-js');
const Accounts = require('./../../Engine/Accounts');
const Account = require('./../../Engine/Account');

class InMemoryAccounts extends Accounts
{
    constructor()
    {
        super();

        this._accounts = []
    }

    addAccount(login, pass, account)
    {
        Assert.string(login);
        Assert.string(pass);
        Assert.instanceOf(account, Account);

        this._accounts.push({
            'login' : login,
            'pass' : pass,
            'account' : account
        })
    }

    /**
     * @param {string} login
     * @param {string} rawPassword
     * @returns {Promise}
     */
    getAccount(login, rawPassword)
    {
        return new Promise((resolve, reject) => {
            for (let accData of this._accounts) {
                if (accData.login === login && accData.pass === rawPassword) {
                    resolve(accData.account);
                    return ;
                }
            }

            reject(new Error(`Account with login ${login} not found.`));
        });
    }
}

module.exports = InMemoryAccounts;