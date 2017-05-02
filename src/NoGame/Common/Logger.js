'use strict';

const bunyan = require('bunyan');

class Logger
{
    /**
     * @param {string} logLevel
     */
    constructor(logLevel)
    {
        this._logger = bunyan.createLogger({
            name: "server",
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

module.exports = Logger;