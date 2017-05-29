describe("Level Calculator", () => {
    const expect = require('expect.js');
    const ExperienceCalculator = require('./../../../src/NoGame/Common/ExperienceCalculator');

    const LOSS_BASE_MODIFIER = 0.45;
    let calculator = new ExperienceCalculator();
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
            expect(calculator.requiredExp(parseInt(level))).to.be(levelExperience[level]);
            expect(parseInt(level)).to.be(calculator.level(calculator.requiredExp(parseInt(level))));
        }
    });

    it("calculates exp loss",() => {

        for (let level in levelExperience) {
            if (parseInt(level) === 1) {
                continue;
            }

            let diff = levelExperience[level] - levelExperience[level - 1];

            expect(calculator.loss(levelExperience[level])).to.be(diff * LOSS_BASE_MODIFIER)
        }
    });

    it("calculates loss for level 1",() => {
        expect(calculator.loss(100)).to.be(45);
    });

    it("calculates 0 loss when modifier bigger than base modifier",() => {

        expect(calculator.loss(1500, LOSS_BASE_MODIFIER + 1)).to.be(0)
    });
});