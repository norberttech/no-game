'use strict';

const Assert = require('assert-js');
const Character = require('./../Character');
const CharacterUI = require('./CharacterUI');

class CharactersUI
{
    constructor()
    {
        this._characters = [];
    }

    /**
     * @param {array<Character>} characters
     */
    updateCharacters(characters)
    {
        Assert.containsOnly(characters, Character);

        this._characters = characters.map((character) => {
            return new CharacterUI(character);
        });
    }

    /**
     * @param {AbsolutePosition} absolutePosition
     * @return {CharacterUI}
     */
    findCharacter(absolutePosition)
    {
        for (let character of this._characters) {
            if (character.position.isEqual(absolutePosition)) {
                return character;
            }
        }

        return null;
    }

    /**
     * @param {string} characterId
     * @param {string} text
     */
    say(characterId, text)
    {
        for (let character of this._characters) {
            if (character.id === characterId) {
                character.say(text);
                return ;
            }
        }
    }

    clear()
    {
        this._characters = [];
    }
}

module.exports = CharactersUI;