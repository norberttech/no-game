'use strict';

const Assert = require('assert-js');
const Player = require('./../Player');
const Size = require('./Size');

class MessageUI
{
    /**
     * @param {string} text
     */
    constructor(text)
    {
        Assert.string(text);

        this._text = text;
        this._endTime = new Date().getTime() + 5000;
    }

    /**
     * @returns {boolean}
     */
    isVisible()
    {
        return new Date().getTime() < this._endTime;
    }

    /**
     * @returns {string}
     */
    getText()
    {
        return this._text;
    }
}

module.exports = MessageUI;