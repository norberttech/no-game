'use strict';

const bunyan = require('bunyan');
const Assert = require('assert-js');
const Logger = require('./../../../../src/NoGame/Common/Logger');

class BunyanLogger extends Logger
{
    /**
     * @param {string} name
     * @param {string} logLevel
     */
    constructor(name, logLevel)
    {
        super();

        Assert.string(name);
        Assert.string(logLevel);

        this._logger = bunyan.createLogger({
            name: name,
            level: logLevel
        });
    }

    fatal(entry)
    {
        this._logger.fatal(entry);
    }

    error(entry)
    {
        this._logger.error(entry);
    }

    warn(entry)
    {
        this._logger.warn(entry);
    }

    info(entry)
    {
        this._logger.info(entry);
    }

    debug(entry)
    {
        this._logger.debug(entry);
    }

    trace(entry)
    {
        this._logger.trace(entry);
    }
}

module.exports = BunyanLogger;