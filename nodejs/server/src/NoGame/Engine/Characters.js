'use strict';

const Assert = require('assert-js');

class Characters
{
    /**
     * @param {string} characterId
     * @returns {Promise}
     */
    get(characterId)
    {
        throw new Error('Method not implemented');
    }

    /**
     * Repositories should not have save method, but because there is no good
     * available Unit of Work we have no better choice.
     *
     * @param {Player} character
     */
    save(character)
    {
        throw new Error('Method not implemented');
    }
}

module.exports = Characters;