'use strict';

import Assert from './../../../JSAssert/Assert';

export default class Message
{
    constroctor()
    {
        this._name = null;
        this._data = {}
    }

    /**
     * @return {string}
     */
    toString()
    {
        return JSON.stringify({name: this._name, data: this._data});
    }
}