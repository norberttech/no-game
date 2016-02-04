'use strict';

import ServiceLocator from './../Common/ServiceLocator';
import BaseBuilder from './../Common/ContainerBuilder';
import AreaMap from './AreaMap';

export default class ContainerBuilder extends BaseBuilder
{
    build()
    {
        let container = new Map();

        this._buildMap(container);

        return container;
    }

    /**
     * @param {Map} container
     * @private
     */
    _buildMap(container)
    {
        container.set('nogame.map', new AreaMap());
    }
}