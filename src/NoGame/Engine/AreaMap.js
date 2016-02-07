'use strict';

import Assert from './../../JSAssert/Assert'
import Area from './Map/Area';

export default class AreaMap
{
    constructor()
    {
        this._area = null;
    }

    /**
     * @param {Area} area
     */
    addArea(area)
    {
        Assert.instanceOf(area, Area);

        this._area = area;
    }

    /**
     * @returns {Area}
     */
    area()
    {
        return this._area;
    }
}