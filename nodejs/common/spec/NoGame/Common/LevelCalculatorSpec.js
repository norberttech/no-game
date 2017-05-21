describe("Level Calculator", () => {
    const expect = require('expect.js');
    const ExperienceCalculator = require('./../../../src/NoGame/Common/ExperienceCalculator');

    const LOSS_BASE_MODIFIER = 1.55;
    let levelExperience = {
        1: 0,
        2:  100,
        3:  200,
        4:  400,
        5:  800,
        6:  1500,
        7:  2600,
        8:  4200,
        9:  6400,
        10: 9300,
    };

    it("calculates exp required for next level", () => {

        for (let level in levelExperience) {
            expect(ExperienceCalculator.requiredExp(parseInt(level))).to.be(levelExperience[level]);
            expect(parseInt(level)).to.be(ExperienceCalculator.level(ExperienceCalculator.requiredExp(parseInt(level))));
        }
    });

    it("calculates exp loss",() => {

        for (let level in levelExperience) {
            if (parseInt(level) === 1) {
                continue;
            }

            let diff = levelExperience[level] - levelExperience[level - 1];

            expect(ExperienceCalculator.loss(levelExperience[level])).to.be(diff * LOSS_BASE_MODIFIER)
        }
    });

    it("calculates 0 loss when modifier bigger than base modifier",() => {

        expect(ExperienceCalculator.loss(1500, LOSS_BASE_MODIFIER + 1)).to.be(0)
    });
});