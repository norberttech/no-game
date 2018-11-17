'use strict';

const Assert = require('assert-js');
const Area = require('./Map/Area');
const Logger = require('./../Common/Logger');
const Tile = require('./Map/Area/Tile');
const TileLayers = require('./Map/Area/TileLayers');
const Item = require('./Map/Area/Item');
const Position = require('./Map/Area/Position');
const MonsterFactory = require('./MonsterFactory');
const Spawn = require('./Spawn');
const Clock = require('./Clock');
const fs = require('fs');

class Loader
{
    /**
     * @param {Logger} logger
     * @param {string} name
     * @param {string} mapPath
     * @param {Clock} clock
     * @returns {Area}
     */
    static loadMapArea(logger, name, mapPath, clock)
    {
        Assert.instanceOf(logger, Logger);
        Assert.string(name);
        Assert.string(mapPath);
        Assert.instanceOf(clock, Clock);

        logger.info(`Loading map from ${mapPath}...`);

        let mapData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

        let area = new Area(name, mapData.width, mapData.height);

        let tileProperties = {};

        mapData.tilesets.map((tileSet) => {
            let props = [];
            for (let tilesIndex in tileSet.tiles) {

                if (!tileSet.tiles.hasOwnProperty(tilesIndex)) {
                    return ;
                }

                let tileId = parseInt(tileSet.firstgid) + parseInt(tileSet.tiles[tilesIndex].id);

                for (let tileProperty of tileSet.tiles[tilesIndex].properties) {

                    if (!tileProperties[tileId]) {
                        tileProperties[tileId] = {};
                    }

                    tileProperties[tileId][tileProperty.name] = tileProperty.value;
                }
            }

            return props;
        });


        let loadLayer = (layerIndex, layer) => {
            let x = 0;
            let y = 0;

            for (let sprite of layer.data) {
                if (x >= layer.width) {
                    x = 0;
                    y++;
                }

                let blocking = (tileProperties[sprite] === undefined)
                    ? false
                    : tileProperties[sprite].blocking;

                let position = new Position(x, y);
                let item = new Item(sprite, blocking);

                if (layerIndex === 0) {
                    area.addTile(new Tile(position,item, new TileLayers()));
                } else {
                    area.tile(position).addItem(layerIndex, item);
                }

                x++;
            }
        };

        loadLayer(0, mapData.layers[0].layers[0]);
        loadLayer(1, mapData.layers[0].layers[1]);
        loadLayer(2, mapData.layers[0].layers[2]);
        loadLayer(3, mapData.layers[0].layers[3]);
        loadLayer(4, mapData.layers[0].layers[4]);

        area.addSpawn(new Spawn("rat", 1, 10000, new Position(30, 12), 1, clock));

        logger.info('tesaria.json loaded!');

        return area;
    }

    /**
     * @param {Logger} logger
     * @returns {MonsterFactory}
     */
    static loadMonsterFactory(logger)
    {
        Assert.instanceOf(logger, Logger);

        logger.info('Loading monster factory...');

        let monsterFactory = new MonsterFactory();

        logger.info('Loading "rat".');

        monsterFactory.addTemplate("rat", 10, 1001, 32, 10, 3000, 5);

        logger.info("Monster factory loaded!");

        return monsterFactory;
    }
}

module.exports = Loader;