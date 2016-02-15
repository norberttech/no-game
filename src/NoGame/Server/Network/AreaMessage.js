'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Area from './../../Engine/Map/Area';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class AreaMessage extends Message
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