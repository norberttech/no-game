'use strict';

import Assert from './../../JSAssert/Assert'
import ServiceLocator from './../Common/ServiceLocator';
import Area from './Map/Area';
import Tile from './Map/Area/Tile';
import Item from './Map/Area/Item';
import Position from './Map/Area/Position';
import fs from 'fs';

export default class Loader
{
    constructor(locator)
    {
        Assert.instanceOf(locator, ServiceLocator);

        this._locator = locator;
    }

    loadAreas()
    {
        var areaData = JSON.parse(fs.readFileSync(__dirname + '/../Common/Resources/Map/testera.json', 'utf8'));

        let area = new Area(areaData.name, areaData.x, areaData.y);

        area.changeSpawnPosition(new Position(areaData.spawnPosition.x, areaData.spawnPosition.y));

        for (let tileConfig of areaData.tiles) {
            let tile = new Tile(
                new Position(tileConfig.x, tileConfig.y),
                new Item(tileConfig.ground.id, tileConfig.ground.blocking)
            );
            area.addTile(tile);
        }


        this._locator.get('nogame.map').addArea(area);
    }
}