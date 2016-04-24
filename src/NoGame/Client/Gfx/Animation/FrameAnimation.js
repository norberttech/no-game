'use strict';

import Assert from 'assert-js';
import Animation from './Animation';

export default class FrameAnimation extends Animation
{
    /**
     * @returns {string}
     */
    get frame()
    {
        throw `Method not implemented.`;
    }
}