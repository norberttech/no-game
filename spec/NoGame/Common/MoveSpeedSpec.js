'use strict';

const MoveSpeed = require('./../../../src/NoGame/Common/MoveSpeed');

describe("Move Speed", () => {
    it("it calculates move speed without modifiers", () => {
        expect(MoveSpeed.calculateMoveTime(1)).toBe(500);
    });

    it("it calculates move speed with modifier", () => {
        expect(MoveSpeed.calculateMoveTime(1, 100)).toBe(499);
        expect(MoveSpeed.calculateMoveTime(1, 1000)).toBe(490);
        expect(MoveSpeed.calculateMoveTime(1, 5000)).toBe(450);
    });
});