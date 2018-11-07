'use strict';

const Assert = require('assert-js');
const Accounts = require('./../../Engine/Accounts');
const Account = require('./../../Engine/Account');
const AccountCharacter = require('./../../Engine/Account/AccountCharacter');
const Pool = require('pg').Pool;
const BcryptJS = require('bcryptjs');

class PgsqlAccounts extends Accounts
{
    constructor(pool)
    {
        super();

        Assert.instanceOf(pool, Pool);

        this._pool = pool;
    }

    /**
     * @param {string} login
     * @param {string} rawPassword
     * @returns {Promise}
     */
    getAccount(login, rawPassword)
    {
        Assert.string(login);
        Assert.string(rawPassword);

        return new Promise((resolve, reject) => {
            this._getAccountId(login,rawPassword)
                .then((accountId) => {
                    this._getAccount(accountId)
                        .then((account) => {
                            resolve(account);
                        })
                        .catch((e) => {
                            reject(e);
                        })
                }).catch((e) => {
                    reject(e);
                })
        });
    }

    /**
     * @returns {Promise}
     * @private
     */
    _getAccountId(login, rawPassword)
    {
        return new Promise((resolve, reject) => {
            this._pool.query(
                'SELECT * FROM nogame_credentials WHERE email = $1',
                [login.toLowerCase()],
                (err, result) => {
                    if (!result.rows.length) {
                        reject(new Error(`Account with login ${login} not found.`));
                        return ;
                    }

                    let hash = result.rows[0].password_hash.replace("$2y", "$2a");

                    if (!BcryptJS.compareSync(rawPassword, hash)) {
                        reject(new Error(`Invalid password for login ${login}.`));
                        return ;
                    }

                    resolve(result.rows[0].account_id);
                }
            )
        });
    }

    _getAccount(accountId)
    {
        Assert.string(accountId);

        return new Promise((resolve, reject) => {
            this._pool.query(
                'SELECT * FROM nogame_character WHERE account_id = $1',
                [accountId],
                (err, result) => {
                    if (!result.rows.length) {
                        resolve(new Account(accountId, []));

                        return ;
                    }


                    resolve(new Account(accountId, result.rows.map((row) => {
                        return new AccountCharacter(row.id, row.name);
                    })));
                }
            )
        });
    }
}

module.exports = PgsqlAccounts;