'use strict';

const Assert = require('assert-js');
const Characters = require('./../../Engine/Characters');
const Player = require('./../../Engine/Player');

class InMemoryCharacters extends Characters
{
    constructor()
    {
        super();

        this._characters = [];
    }

    addCharacter(id, character)
    {
        Assert.string(id);
        Assert.instanceOf(character, Player);

        this._characters.push({
            'id' : id,
            'player' : character
        })
    }

    /**
     * @param {string} characterId
     * @returns {Promise}
     */
    get(characterId)
    {
        return new Promise((resolve, reject) => {
            for (let charData of this._characters) {
                if (charData.id === characterId) {
                    resolve(charData.player);
                    return ;
                }
            }

            reject(new Error(`Character with id ${characterId} des not exists.`));
        });
    }

    /**
     * @param {Player} character
     */
    save(character)
    {
        Assert.instanceOf(character, Player);
        // do nothing, its in memory
    }
}

module.exports = InMemoryCharacters;