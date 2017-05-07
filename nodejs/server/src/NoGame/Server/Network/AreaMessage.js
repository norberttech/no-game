'use strict';

const Assert = require('assert-js');
const Message = require('nogame-common').NetworkMessage;
const Area = require('./../../Engine/Map/Area');
const ServerMessages = require('nogame-common').ServerMessages;

class AreaMessage extends Message
{
    /**
     * @param {string} areaName
     * @param {int} visibleTilesX
     * @param {int} visibleTilesY
     */
    constructor(areaName, visibleTilesX, visibleTilesY)
    {
        super();

        Assert.string(areaName);
        Assert.integer(visibleTilesX);
        Assert.integer(visibleTilesY);

        this._name = ServerMessages.AREA;
        this._data = {
            name: areaName,
            visibleTiles: {
                x: visibleTilesX,
                y: visibleTilesY
            }
        };
    }
}

module.exports = AreaMessage;