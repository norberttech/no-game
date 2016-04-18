'use strict';

import Assert from 'assert-js';
import LinearAnimation from './Animation/LinearAnimation';

export default class Animations
{
    static bloodSplashAnimation()
    {
        let frames = [41, 42, 43, 44, 45];

        return new LinearAnimation(frames, 100, false);
    }
}