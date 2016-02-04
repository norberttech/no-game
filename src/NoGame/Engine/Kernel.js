'use strict';

import Assert from './../../JSAssert/Assert';
import Loader from './Loader';
import ContainerBuilder from './ContainerBuilder';
import ServiceLocator from './../Common/ServiceLocator';

export default class Kernel
{
    constructor()
    {
        this._version = '1.0.0-DEV';
        this._locator = new ServiceLocator(new ContainerBuilder());
        this._loader = new Loader(this._locator);
        this._loaded = false;
    }

    boot()
    {
        this._loader.loadAreas();

        this._loaded = true;
    }

    /**
     * @returns {boolean}
     */
    isLoaded()
    {
        return this._loaded;
    }
}