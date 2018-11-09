'use strict';

const Assert = require('assert-js');
const Area = require('./Map/Area');
const Logger = require('./../Common/Logger');
const Tile = require('./Map/Area/Tile');
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
            for (let tileId in tileSet.tileproperties) {

                if (!tileSet.tileproperties.hasOwnProperty(tileId)) {
                    return ;
                }

                tileProperties[parseInt(tileSet.firstgid) + parseInt(tileId)] = tileSet.tileproperties[tileId];
            }

            return props;
        });

        for (let layer of mapData.layers) {
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

                if (area.hasTile(position)) {
                    area.tile(position).putOnStack(item)
                } else {
                    area.addTile(new Tile(position,item));
                }

                x++;
            }
        }

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