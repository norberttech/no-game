'use strict';

const Assert = require('assert-js');
const PlayerUI = require('./PlayerUI');
const Character = require('./../Character');
const CharacterUI = require('./CharacterUI');

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
     * @param {int} relativeTileX
     * @param {int} relativeTileY
     * @returns {CharacterUI[]}
     */
    getVisibleCharacters(relativeTileX, relativeTileY)
    {
        let visibleCharacters = [];

        for (let character of this._characters) {
            let relativeX = character.getRelativeX(relativeTileX, relativeTileY);
            let relativeY = character.getRelativeY(relativeTileX, relativeTileY);

            if (relativeX >= 0 && relativeX < relativeTileX && relativeY >= 0 && relativeY < relativeTileY) {
                visibleCharacters.push(character);
            }
        }

        return visibleCharacters;
    }

    /**
     * @param {int} absoluteTileX
     * @param {int} absoluteTileY
     * @return {CharacterUI}
     */
    character(absoluteTileX, absoluteTileY)
    {
        for (let character of this._characters) {
            if (character.x === absoluteTileX && character.y === absoluteTileY) {
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