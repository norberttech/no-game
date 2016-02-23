'use strict';

import Assert from './../../../JSAssert/Assert';

const MESSAGE_TEMPLATE = `<div class="time">__TIME__</div><div class="content">__USERNAME__: __MESSAGE__</div>`;

export default class Chat
{
    /**
     * @param {HTMLDocument} doc
     * @param {HTMLElement} chatContainer
     * @param {HTMLElement} inputContainer
     */
    constructor(doc, chatContainer, inputContainer)
    {
        Assert.instanceOf(doc, HTMLDocument);
        Assert.instanceOf(chatContainer, HTMLElement);
        Assert.instanceOf(inputContainer, HTMLElement);

        this._doc = doc;
        this._chatContainer = chatContainer;
        this._packet = chatContainer.querySelector('.messages');
        this._input = inputContainer.querySelector('input[type="text"]');
        this._currentUsername = null;
        this._onCharacterSay = null;
        this._bindChatInputEvents(this);
    }

    /**
     * @param {string} username
     */
    setCurrentUsername(username)
    {
        Assert.string(username);

        this._currentUsername = username;
    }

    /**
     * @param {function} callback
     */
    setOnSay(callback)
    {
        Assert.isFunction(callback);

        this._onCharacterSay = callback;
    }

    /**
     * @param {Date} time
     * @param {string} message
     */
    say(time, message)
    {
        if (null === this._currentUsername) {
            throw `Only logged users can use chat`;
        }

        if (null !== this._onCharacterSay) {
            this._onCharacterSay(message);
        }

        this.addMessage(time, this._currentUsername, message);
    }

    /**
     * @param {Date} time
     * @param {string} username
     * @param {string} message
     */
    addMessage(time, username, message)
    {
        Assert.instanceOf(time, Date);
        Assert.string(username);
        Assert.string(message);

        let msgElement = this._doc.createElement('div');
        msgElement.classList.add('message');

        msgElement.innerHTML = MESSAGE_TEMPLATE
            .replace(
                '__TIME__',
                this._format(time.getHours(), 2) + ':' + this._format(time.getMinutes(), 2) + ':' + this._format(time.getSeconds(), 2)
            ).replace('__USERNAME__', username)
            .replace('__MESSAGE__', message);

        this._packet.appendChild(msgElement);
        this._chatContainer.scrollTop = this._chatContainer.scrollHeight;

    }

    /**
     * @private
     */
    _bindChatInputEvents() {
        this._input.addEventListener("keydown", (event) => {
            if (event.keyCode === 13) {
                this.say(new Date(), this._input.value);

                this._input.value = '';
                event.preventDefault();
            }
        });
    }

    /**
     * @param {int} number
     * @param {int} leadingZeroes
     * @returns {string}
     * @private
     */
    _format(number, leadingZeroes) {
        Assert.integer(number);
        Assert.integer(leadingZeroes);

        let s = number + "";

        while (s.length < leadingZeroes) {
            s = "0" + s
        }

        return s;
    }
}