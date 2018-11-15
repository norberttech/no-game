'use strict';

const Assert = require('assert-js');
const SpriteFile = require('./SpriteFile');

class SpriteMap
{
    constructor()
    {
        this._spriteFiles = new Map();
    }

    /**
     * @param {SpriteFile} spriteFile
     */
    add(spriteFile)
    {
        Assert.instanceOf(spriteFile, SpriteFile);

        this._spriteFiles.set(spriteFile.name, spriteFile);
    }

    load()
    {
        for (let sprite of this._spriteFiles.values()) {
            sprite.load((sprite) => {
                console.log(`Sprite ${sprite.name} loaded.`);
            });
        }
    }

    /**
     * @param {int} id
     * @returns {Sprite}
     */
    hasSprite(id)
    {
        if (id <= 0) {
            return false;
        }

        for (let spriteFile of this._spriteFiles.values()) {
            if (spriteFile.hasId(id)) {
                return true;
            }
        }

        throw false;
    }

    /**
     * @param {int} id
     * @returns {Sprite}
     */
    getSprite(id)
    {
        for (let spriteFile of this._spriteFiles.values()) {
            if (spriteFile.hasId(id)) {
                return spriteFile.getSprite(id);
            }
        }

        throw new Error(`Sprite with id "${id}" does not exists.`);
    }

    /**
     * @returns {boolean}
     */
    isLoaded()
    {
        for (let sprite of this._spriteFiles.values()) {
            if (!sprite.isLoaded()) {
                return false;
            }
        }

        return true;
    }
}

module.exports = SpriteMap;