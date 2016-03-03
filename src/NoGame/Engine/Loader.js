'use strict';

import Assert from 'assert-js'
import Area from './Map/Area';
import Logger from './../Common/Logger';
import Tile from './Map/Area/Tile';
import Item from './Map/Area/Item';
import Position from './Map/Area/Position';
import fs from 'fs';

export default class Loader
{
    /**
     * @param {Kernel} kernel
     * @param {Logger} logger
     */
    static loadAreas(kernel, logger)
    {
        logger.info('Loading tesaria.json...');
        var areaData = JSON.parse(fs.readFileSync(__dirname + '/../Engine/Resources/Map/tesaria.json', 'utf8'));

        let area = new Area("Tesaria", areaData.width, areaData.height);

        let groundTiles = areaData.layers[0];
        let groundsTileSet = areaData.tilesets[0];

        area.changeSpawnPosition(new Position(groundTiles.properties.spawnPositionX, groundTiles.properties.spawnPositionY));

        let x = 0;
        let y = 0;

        for (let sprite of groundTiles.data) {
            if (x >= areaData.width) {
                x = 0;
                y++;
            }
            if (groundsTileSet.tileproperties[sprite - 1] === undefined) {
                throw `Missing "blocking" property on tile ${x}:${y} - ${sprite}`;
            }

            let tile = new Tile(
                new Position(x, y),
                new Item(sprite, groundsTileSet.tileproperties[sprite - 1].blocking)
            );
            area.addTile(tile);

            x++;
        }

        kernel.setArea(area);

        logger.info('tesaria.json loaded!');
    }
}