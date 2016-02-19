'use strict';

export default class KeyBoard
{
    constructor()
    {
        this._pressedKeys = new Map();
    }

    /**
     * @param {int} keyCode
     */
    keyDown(keyCode)
    {
        this._pressedKeys.set(keyCode, true);
    }

    /**
     * @param {int} keyCode
     */
    keyUp(keyCode)
    {
        this._pressedKeys.set(keyCode, false);
    }

    /**
     * @param {int} keyCode
     * @returns {bool}
     */
    isKeyPressed(keyCode)
    {
        if (!this._pressedKeys.has(keyCode)) {
            return false;
        }

        return this._pressedKeys.get(keyCode);
    }
}