'use strict';

import Assert from './../../JSAssert/Assert';
import ContainerBuilder from './ContainerBuilder';

export default class ServiceLocator
{
    /**
     * @param {ContainerBuilder} containerBuilder
     */
    constructor(containerBuilder)
    {
        Assert.instanceOf(containerBuilder, ContainerBuilder);

        this._container = containerBuilder.build();
    }

    /**
     * @param {string} serviceId
     */
    get(serviceId)
    {
        Assert.string(serviceId);

        if (!this._container.has(serviceId)) {
            throw `Service with id "${serviceId}" does not exists`;
        }

        return this._container.get(serviceId);
    }
}