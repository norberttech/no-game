'use strict';

import Assert from './../../../JSAssert/Assert';
import Sprite from './Sprite';

export default class SpriteMap
{
    constructor()
    {
        this._sprites = new Map();
    }

    /**
     * @param {Sprite} sprite
     */
    add(sprite)
    {
        Assert.instanceOf(sprite, Sprite);

        this._sprites.set(sprite.name(), sprite);
    }

    load()
    {
        for (let sprite of this._sprites.values()) {
            sprite.load((sprite) => {
                console.log(`Sprite ${sprite.name()} loaded.`);
            });
        }
    }

    /**
     * @returns {boolean}
     */
    isLoaded()
    {
        for (let sprite of this._sprites.values()) {
            if (!sprite.isLoaded()) {
                return false;
            }
        }

        return true;
    }
}