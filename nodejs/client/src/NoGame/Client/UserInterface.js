'use strict';

import Assert from 'assert-js';
import Engine from './Gfx/Engine';
import KeyBoard from './Input/KeyBoard';
import Mouse from './Input/Mouse';
import Chat from './UserInterface/Chat';

export default class UserInterface
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
        this._loginForm = this._loginScreen.querySelector("form");
        this._packet = this._doc.querySelector("#messages");
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
            let userName = this._loginForm.querySelector('input[name="username"]');
            event.preventDefault();

            if (userName.value.length) {
                callback(userName.value);
                userName.value = '';
            }
        });
    }

    addErrorMessage(text)
    {
        let message = this._doc.createElement("div");
        message.classList.add("alert");
        message.classList.add("alert-error");
        message.innerHTML = text;

        this._packet.appendChild(message);
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