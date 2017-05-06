'use strict';

const Logger = require('./../../../../src/NoGame/Common/Logger');

class MemoryLogger extends Logger
{
    constructor()
    {
        super();
        this._fatal = [];
        this._error = [];
        this._warn = [];
        this._info = [];
        this._debug = [];
        this._trace = [];
    }

    fatal(entry)
    {
        this._fatal.push(entry);
    }

    error(entry)
    {
        this._error.push(entry);
    }

    warn(entry)
    {
        this._warn.push(entry);
    }

    info(entry)
    {
        this._info.push(entry);
    }

    debug(entry)
    {
        this._debug.push(entry);
    }

    trace(entry)
    {
        this._trace.push(entry);
    }
}

module.exports = MemoryLogger;