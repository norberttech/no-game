describe("Move Speed", () => {
    const expect = require('expect.js');
    const MoveSpeed = require('./../../../src/NoGame/Common/MoveSpeed');

    it("it calculates move speed without modifiers", () => {
        expect(MoveSpeed.calculateMoveTime(1)).to.be(500);
    });

    it("it calculates move speed with modifier", () => {
        expect(MoveSpeed.calculateMoveTime(1, 100)).to.be(499);
        expect(MoveSpeed.calculateMoveTime(1, 1000)).to.be(490);
        expect(MoveSpeed.calculateMoveTime(1, 5000)).to.be(450);
    });
});