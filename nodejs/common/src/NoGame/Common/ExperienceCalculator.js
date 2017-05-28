'use strict';

const Assert = require('assert-js');

class ExperienceCalculator
{
    /**
     * @param {int} level
     * @returns {int}
     */
    requiredExp(level)
    {
        Assert.integer(level);

        if (level < 1) {
            return 0;
        }

        return (50 * Math.pow(level - 1, 3) - 150 * Math.pow(level - 1, 2) + 400 * (level - 1)) / 3;
    }

    /**
     * @param {int} exp
     * @returns {int}
     */
    level(exp)
    {
        Assert.integer(exp);

        let lvl = 1;

        while (true) {
            let requiredExp = this.requiredExp(lvl);

            if (requiredExp > exp) {
                return lvl - 1;
            }

            lvl++;
        }
    }

    /**
     * @param {int} exp
     * @param {float} modifier
     * @returns {number}
     */
    loss(exp, modifier = 0.0)
    {
        Assert.integer(exp);
        Assert.number(modifier);

        let currentLevel = this.level(exp);
        let currentLevelExp = this.requiredExp(currentLevel);
        let previousLevelExp = this.requiredExp(currentLevel - 1);

        let expDifference = currentLevelExp - previousLevelExp;

        let baseLoss = 0.45;
        let loss = (baseLoss - modifier <= 0) ? 0 : baseLoss - modifier;

        return Math.ceil(expDifference * loss);
    }
}

module.exports = ExperienceCalculator;