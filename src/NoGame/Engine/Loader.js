'use strict';

import Assert from './../../JSAssert/Assert'
import ServiceLocator from './../Common/ServiceLocator';
import Area from './Map/Area';
import Tile from './Map/Area/Tile';
import Item from './Map/Area/Item';
import Position from './Map/Area/Position';

export default class Loader
{
    constructor(locator)
    {
        Assert.instanceOf(locator, ServiceLocator);

        this._locator = locator;
    }

    loadAreas()
    {
        let area = new Area('areia', 100, 100);

        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                let tile = new Tile(new Position(x, y), new Item(1));
                area.addTile(tile);
            }
        }

        this._locator.get('nogame.map').addArea(area);
    }
}