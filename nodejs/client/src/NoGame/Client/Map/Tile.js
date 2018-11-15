'use strict';

const Assert = require('assert-js');
const AbsolutePosition = require('./../Tile/AbsolutePosition');

class Tile
{
    /**
     * @param {int} x
     * @param {int} y
     * @param {boolean} canWalkOn
     * @param {int} ground
     * @param {int} layer1
     * @param {int} layer2
     * @param {int} layer3
     * @param {int} layer4
     * @param {int} moveSpeedModifier
     */
    constructor(x, y, canWalkOn, ground, layer1, layer2, layer3, layer4, moveSpeedModifier)
    {
        Assert.integer(x);
        Assert.integer(y);
        Assert.boolean(canWalkOn);
        Assert.integer(ground);
        Assert.integer(layer1);
        Assert.integer(layer2);
        Assert.integer(layer3);
        Assert.integer(layer4);
        Assert.integer(moveSpeedModifier);

        this._x = x;
        this._y = y;
        this._canWalkOn = canWalkOn;
        this._ground = ground;
        this._layer1 = layer1;
        this._layer2 = layer2;
        this._layer3 = layer3;
        this._layer4 = layer4;
        this._moveSpeedModifier = moveSpeedModifier;
    }

    /**
     * @returns {int}
     */
    get x()
    {
        return this._x;
    }

    /**
     * @returns {int}
     */
    get y()
    {
        return this._y;
    }

    /**
     * @returns {AbsolutePosition}
     */
    get position()
    {
        return new AbsolutePosition(this._x, this._y);
    }

    /**
     * @returns {int}
     */
    get ground()
    {
        return this._ground;
    }

    /**
     * @returns {int}
     */
    get layer1()
    {
        return this._layer1;
    }

    /**
     * @returns {int}
     */
    get layer2()
    {
        return this._layer2;
    }

    /**
     * @returns {int}
     */
    get layer3()
    {
        return this._layer3;
    }

    /**
     * @returns {int}
     */
    get layer4()
    {
        return this._layer4;
    }

    /**
     * @returns {string}
     */
    toString()
    {
        return `${this._x}:${this._y}`;
    }

    /**
     * @returns {boolean}
     */
    get canWalkOn()
    {
        return this._canWalkOn;
    }

    /**
     * @returns {int}
     */
    get moveSpeedModifier()
    {
        return this._moveSpeedModifier;
    }
}

module.exports = Tile;