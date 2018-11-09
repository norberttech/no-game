describe("Move Speed Calculator", () => {
    const Assert = require('assert-js');
    const MoveSpeed = require('./../../../src/NoGame/Common/MoveSpeed');

    it("calculates move speed without modifiers", () => {
        Assert.equal(MoveSpeed.calculateMoveTime(1),500);
    });

    it("calculates move speed with modifier", () => {
        Assert.equal(MoveSpeed.calculateMoveTime(1, 100), 499);
        Assert.equal(MoveSpeed.calculateMoveTime(1, 1000), 490);
        Assert.equal(MoveSpeed.calculateMoveTime(1, 5000) ,450);
    });
});