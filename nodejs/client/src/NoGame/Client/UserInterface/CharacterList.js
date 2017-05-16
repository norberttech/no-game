'use strict';

const Assert = require('assert-js');

const CHARACTER_TEMPLATE = `<div class="character"><label><input type="radio" value="__CHARACTER_ID__" name="character" /> __CHARACTER_NAME__</label></div>`;

class CharacterList
{
    /**
     * @param {HTMLDocument} doc
     * @param {HTMLDivElement} element
     */
    constructor(doc, element)
    {
        Assert.instanceOf(doc, HTMLDocument);
        Assert.instanceOf(element, HTMLDivElement);

        this._doc = doc;
        this._element = element;
    }

    show()
    {
        this.clear();
        this._element.style.display = 'block';
    }

    hide()
    {
        this._element.style.display = 'none';
    }

    /**
     * @param {string} id
     * @param {string} name
     */
    addCharacter(id, name)
    {
        Assert.string(id);
        Assert.string(name);

        let characterElement = this._doc.createElement('div');

        characterElement.innerHTML = CHARACTER_TEMPLATE
            .replace('__CHARACTER_ID__', id)
            .replace('__CHARACTER_NAME__', name);

        this._element.querySelector('.list').appendChild(characterElement);
    }

    clear()
    {
        this._element.querySelector('.list').innerHTML = '';
    }

    emptyList()
    {
        this._element.querySelector('.list').innerHTML = '<div>Sorry your character list is empty, please create character first.</div>';
    }

    get isCharacterSelected()
    {
        return this._element.querySelector('.list').querySelector('input[type="radio"]:checked') !== null;
    }

    /**
     * @returns {string}
     */
    get selectedCharacterId()
    {
        return this._element.querySelector('.list').querySelector('input[type="radio"]:checked').value;
    }

    /**
     * @param callback
     */
    onLoginSubmit(callback)
    {
        Assert.isFunction(callback);
        this._element.querySelector('#character-login').addEventListener('click', callback);
    }
}

module.exports = CharacterList;