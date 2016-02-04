'use strict';

import Assert from './../../JSAssert/Assert'
import Area from './Map/Area';

export default class GameMap
{
    constructor()
    {
        this._area = null;
    }

    addArea(area)
    {
        Assert.instanceOf(area, Area);

        this._area = area;
    }

    area()
    {
        return this._area;
    }
}