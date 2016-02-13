'use strict';

import Assert from './../../../JSAssert/Assert';
import Message from './../../Common/Network/Message';
import Area from './../../Engine/Map/Area';
import ServerMessages from './../../Common/Network/ServerMessages';

export default class AreaMessage extends Message
{
    /**
     * @param {Area} area
     */
    constructor(area)
    {
        super();

        Assert.instanceOf(area, Area);

        this._name = ServerMessages.AREA;
        this._data = {
            name: area.name(),
            x: area.sizeX(),
            y: area.sizeY(),
            tiles: area.tiles().map(function(tile) {
                return {
                    x: tile.position().x(),
                    y: tile.position().y(),
                    canWalkOn: tile.canWalkOn(),
                    stack: [
                        tile.ground().spriteId()
                    ]
                }
            })
        };
    }
}