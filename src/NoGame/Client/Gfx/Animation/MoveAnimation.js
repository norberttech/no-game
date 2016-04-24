'use strict';

import Assert from 'assert-js';
import Animation from './Animation';

export default class MoveAnimation extends Animation
{
    /**
     * @returns {int}
     */
    get distance()
    {
        throw `Method not implemented.`;
    }
}
