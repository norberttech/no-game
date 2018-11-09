'use strict';

const Assert = require('assert-js');
const PlayerUI = require('./PlayerUI');
const Character = require('./../Character');
const CharacterUI = require('./CharacterUI');
const Size = require('./Size');

class CharactersUI
{
    constructor()
    {
        this._characters = [];
    }

    /**
     * @param {Character} characters
     * @param {PlayerUI} player
     */
    updateCharacters(characters, player)
    {
        Assert.containsOnly(characters, Character);
        Assert.instanceOf(player, PlayerUI);

        this._characters = characters.map((character) => {
            return new CharacterUI(character, player);
        });
    }

    /**
     * @param {int} visibleX
     * @param {int} visibleY
     * @returns {CharacterUI[]}
     */
    getVisibleCharacters(visibleX, visibleY)
    {
        let visibleCharacters = [];

        for (let character of this._characters) {
            let relativeX = character.getRelativeX(visibleX, visibleY);
            let relativeY = character.getRelativeY(visibleX, visibleY);

            if (relativeX >= 0 && relativeX < visibleX && relativeY >= 0 && relativeY < visibleY) {
                visibleCharacters.push(character);
            }
        }

        return visibleCharacters;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @return {CharacterUI}
     */
    character(x, y)
    {
        for (let character of this._characters) {
            if (character.x === x && character.y === y) {
                return character;
            }
        }
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