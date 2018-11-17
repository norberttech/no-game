'use strict';

const Assert = require('assert-js');
const Item = require('./Item');

class TileLayers
{
    /**
     * @param {Item} [layer1Item]
     * @param {Item} [layer2Item]
     * @param {Item} [layer3Item]
     * @param {Item} [layer4Item]
     */
    constructor(layer1Item = new Item(0, false), layer2Item = new Item(0, false), layer3Item = new Item(0, false), layer4Item = new Item(0, false))
    {
        this._layer1 = layer1Item;
        this._layer2 = layer2Item;
        this._layer3 = layer3Item;
        this._layer4 = layer4Item;

    }

    /**
     * @returns {boolean}
     */
    get isBlocking()
    {
        return this._layer1.isBlocking || this._layer2.isBlocking || this._layer3.isBlocking || this._layer4.isBlocking;
    }

    /**
     * @param {int} layerIndex
     * @returns {Item}
     */
    getLayer(layerIndex)
    {
        Assert.greaterThan(0, layerIndex);
        Assert.lessThan(5, layerIndex);

        return this['_layer' + layerIndex];
    }

    /**
     * @param {int} layerIndex
     * @param {Item} item
     */
    addItem(layerIndex, item)
    {
        Assert.greaterThan(0, layerIndex);
        Assert.lessThan(5, layerIndex);
        Assert.instanceOf(item, Item);

        this['_layer' + layerIndex] = item;
    }
}

module.exports = TileLayers;