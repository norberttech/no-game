'use strict';

import Assert from './../../JSAssert/Assert';
import Engine from './Gfx/Engine';
import Keys from './UserInterface/Keys';

export default class UserInterface
{
    /**
     * @param {HTMLDocument} doc
     */
    constructor(doc)
    {
        Assert.instanceOf(doc, HTMLDocument);

        this._doc = doc;
        this._loginScreen = this._doc.getElementById("login-screen");
        this._loginForm = this._loginScreen.querySelector("form");
        this._messages = this._doc.querySelector("#messages");
        this._gameCanvas = this._doc.querySelector("#canvas-wrapper");
    }

    showLoginScreen()
    {
        this._loginScreen.style.display = 'block';
    }

    showCanvas()
    {
        this._gameCanvas.style.display = 'block';
    }

    hideLoginScreen()
    {
        this._loginScreen.style.display = 'none';
    }

    hideCanvas()
    {
        this._gameCanvas.style.display = 'none';
    }

    onLoginSubmit(callback)
    {
        this._loginForm.addEventListener("submit", (event) => {
            let userName = this._loginForm.querySelector('input[name="username"]');
            event.preventDefault();

            if (userName.value.length) {
                callback(userName.value);
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

    /**
     * @param callback
     */
    bindArrows(callback)
    {
        this._doc.addEventListener("keydown", (event) => {
            switch(event.keyCode) {
                case 37: //left
                    callback(Keys.LEFT);
                    event.preventDefault();
                    break;
                case 38: //up
                    callback(Keys.UP);
                    event.preventDefault();
                    break;
                case 39: //right
                    callback(Keys.RIGHT);
                    event.preventDefault();
                    break;
                case 40: //down
                    callback(Keys.DOWN);
                    event.preventDefault();
                    break;
            }
        });
    }
}