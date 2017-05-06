'use strict';

import Assert from 'assert-js';
import Player from './../Player';
import Size from './Size';

export default class MessageUI
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