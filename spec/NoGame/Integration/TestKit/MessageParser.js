'use strict';

const Assert = require('assert-js');

class MessageParser
{
    /**
     * @param {string} message
     */
    static parse(message)
    {
        Assert.string(message);

        return JSON.parse(message);
    }

    /**
     * @param {string} message
     * @returns []
     */
    static parseBatch(message)
    {
        Assert.string(message);

        let batch = this.parse(message);

        return batch.data.messages.map((msg) => {
            return JSON.parse(msg);
        });
    }
}

module.exports = MessageParser;