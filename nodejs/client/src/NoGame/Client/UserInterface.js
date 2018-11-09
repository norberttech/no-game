'use strict';

const Assert = require('assert-js');
const KeyBoard = require('./Input/KeyBoard');
const Mouse = require('./Input/Mouse');
const Chat = require('./UserInterface/Chat');
const CharacterList = require('./UserInterface/CharacterList');

class UserInterface
{
    /**
     * @param {HTMLDocument} doc
     * @param {KeyBoard} keyboard
     * @param {Mouse} mouse
     */
    constructor(doc, keyboard, mouse)
    {
        Assert.instanceOf(doc, HTMLDocument);
        Assert.instanceOf(keyboard, KeyBoard);
        Assert.instanceOf(mouse, Mouse);

        this._doc = doc;
        this._keyboard = keyboard;
        this._mouse = mouse;
        this._loginScreen = this._doc.getElementById("login-screen");
        this._loginCharacterListScreen = new CharacterList(this._doc, this._doc.getElementById("login-character-list-screen"));
        this._loginForm = this._loginScreen.querySelector("form");
        this._messages = this._doc.querySelector("#messages");
        this._gameCanvasWrapper = this._doc.querySelector("#game-wrapper");
        this._gameCanvas = this._doc.querySelector("#game-canvas");
        this._chat = new Chat(this._doc, this._doc.querySelector('#chat'), this._doc.querySelector('#chat-input'));
    }

    /**
     * @returns {Chat}
     */
    chat()
    {
        return this._chat;
    }

    /**
     * @returns {CharacterList}
     */
    get characterList()
    {
        return this._loginCharacterListScreen;
    }

    /**
     * @param {function} callback
     */
    onSay(callback)
    {
        this.chat().setOnSay(callback);
    }

    showLoginScreen()
    {
        this._loginScreen.style.display = 'block';
    }

    showCanvas()
    {
        this._gameCanvasWrapper.style.display = 'block';
    }

    hideLoginScreen()
    {
        this._loginScreen.style.display = 'none';
    }

    hideCanvas()
    {
        this._gameCanvasWrapper.style.display = 'none';
    }

    onLoginSubmit(callback)
    {
        this._loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            this.clearErrorMessages();

            let username = this._loginForm.querySelector('input[name="username"]');
            let password = this._loginForm.querySelector('input[name="password"]');

            if (username.value.length && password.value.length) {
                callback(username.value, password.value);
                username.value = '';
                password.value = '';
            } else {
                this.addErrorMessage("Username and password can't be empty");
            }
        });
    }

    addErrorMessage(text)
    {
        let message = this._doc.createElement("div");
        message.classList.add("alert");
        message.classList.add("alert-error");
        message.innerHTML = text;

        this._messages.appendChild(message);
    }

    clearErrorMessages()
    {
        this._messages.innerHTML = '';
    }

    bindArrows()
    {
        this._doc.addEventListener("keydown", (event) => {
            this._keyboard.keyDown(event.keyCode);
        });

        this._doc.addEventListener("keyup", (event) => {
            this._keyboard.keyUp(event.keyCode);
        });
    }

    bindMouse()
    {
        this._gameCanvas.addEventListener("mousemove", (event) => {
            this._mouse.setPosition(
                event.pageX - this._gameCanvas.offsetLeft,
                event.pageY - this._gameCanvas.offsetTop
            );
        });

        this._gameCanvas.addEventListener("click", (event) => {
            this._mouse.click();
        });
    }

    bindWindowResize()
    {
        window.addEventListener("resize", (event) => {
            this.resizeUI();
        });
    }

    resizeUI()
    {
        let width = (this._doc.body.clientWidth * 0.8);
        let height = this._doc.body.clientHeight;

        if (this._gameCanvas.hasAttribute('data-visible-tiles-x') && this._gameCanvas.hasAttribute('data-visible-tiles-y')) {
            let tilesY = this._gameCanvas.getAttribute('data-visible-tiles-y');
            let tilesX = this._gameCanvas.getAttribute('data-visible-tiles-x');

            let tileWidth = Math.round(width / tilesX);
            let tileHeight = Math.round(height / tilesY);
            let tileSize = Math.max(tileWidth, tileHeight);

            while(tileSize > 32) {
                if (tileSize * tilesX < width && tileSize * tilesY < height) {
                    break;
                }

                tileSize--;
            }

            this._gameCanvas.setAttribute('width', tileSize * tilesX);
            this._gameCanvas.setAttribute('height', tileSize * tilesY);

            this._gameCanvas.style.marginLeft = Math.round((width - (tileSize * tilesX)) / 2) + 'px';
        }
    }
}

module.exports = UserInterface;