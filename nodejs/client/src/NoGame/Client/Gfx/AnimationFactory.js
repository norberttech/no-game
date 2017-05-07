'use strict';

import Assert from 'assert-js';
import LinearFrameAnimation from './Animation/LinearFrameAnimation';
import TextFadeOutAnimation from './Animation/TextFadeOutAnimation';
import Colors from './Colors';
import Font from './Font';

export default class AnimationFactory
{
    /**
     * @returns {LinearFrameAnimation}
     */
    static bloodSplashAnimation()
    {
        let frames = [41, 42, 43, 44, 45];

        return new LinearFrameAnimation(frames, 100, false);
    }

    /**
     * @returns {LinearFrameAnimation}
     */
    static parryAnimation()
    {
        let frames = [51, 52, 53, 54, 55];

        return new LinearFrameAnimation(frames, 100, false);
    }

    /**
     * @param {int} health
     * @returns {TextFadeOutAnimation}
     */
    static healthFadeOut(health)
    {
        Assert.integer(health);

        let font = new Font('Verdana', 'normal', 15, Colors.LOOSE_HEALTH);

        return new TextFadeOutAnimation(health.toString(), font, 50, 50, 5);
    }
}