'use strict';

const Assert = require('assert-js');
const LinearFrameAnimation = require('./Animation/LinearFrameAnimation');
const TextFadeOutAnimation = require('./Animation/TextFadeOutAnimation');
const Colors = require('./Colors');
const Font = require('./Font');

class AnimationFactory
{
    /**
     * @returns {LinearFrameAnimation}
     */
    static bloodSplashAnimation()
    {
        let frames = [100, 101, 102, 103, 104];

        return new LinearFrameAnimation(frames, 100, false);
    }

    /**
     * @returns {LinearFrameAnimation}
     */
    static parryAnimation()
    {
        let frames = [120, 121, 122, 123, 124];

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

module.exports = AnimationFactory;