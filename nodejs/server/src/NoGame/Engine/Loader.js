'use strict';

const Assert = require('assert-js');
const Area = require('./Map/Area');
const Logger = require('nogame-common').Logger;
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

        let areaData = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

        let area = new Area(name, areaData.width, areaData.height);

        let groundTiles = areaData.layers[0];
        let groundsTileSet = areaData.tilesets[0];

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

        area.addSpawn(new Spawn("rat", 1, 10000, new Position(30, 12), 1, clock));

        logger.info('tesaria.json loaded!');

        return area;
    }

    /**
     * @param {Logger} logger
     * @param {Clock} clock
     * @returns {MonsterFactory}
     */
    static loadMonsterFactory(logger, clock)
    {
        Assert.instanceOf(logger, Logger);
        Assert.instanceOf(clock, Clock);

        logger.info('Loading monster factory...');

        let monsterFactory = new MonsterFactory(clock);

        logger.info('Loading "rat".');
        monsterFactory.addTemplate("rat", 1001, 32, 50, 3000, 5);

        logger.info("Monster factory loaded!");

        return monsterFactory;
    }
}

module.exports = Loader;