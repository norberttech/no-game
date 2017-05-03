'use strict';

const Assert = require('assert-js');
const Area = require('./../../../../src/NoGame/Engine/Map/Area');
const Position = require('./../../../../src/NoGame/Engine/Map/Area/Position');
const Tile = require('./../../../../src/NoGame/Engine/Map/Area/Tile');
const Item = require('./../../../../src/NoGame/Engine/Map/Area/Item');

class AreaFactory
{
    /**
     * @param {int} sizeX
     * @param {int} sizeY
     * @returns {Area}
     */
    static emptyWalkable(sizeX, sizeY)
    {
        Assert.integer(sizeX);
        Assert.integer(sizeY);

        let area = new Area("Test", sizeX, sizeY);

        for (let x = 0; x <= sizeX; x++) {
            for (let y = 0; y <= sizeY; y++) {
                area.addTile(new Tile(new Position(x, y), new Item(0, false)))
            }
        }

        return area;
    }
}

module.exports = AreaFactory;