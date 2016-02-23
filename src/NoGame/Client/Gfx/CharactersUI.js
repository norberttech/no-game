'use strict';

import Assert from './../../../JSAssert/Assert';
import PlayerUI from './PlayerUI';
import Character from './../Character';
import CharacterUI from './CharacterUI';
import Size from './Size';

export default class CharactersUI
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
}