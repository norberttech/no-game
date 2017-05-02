'use strict';

const Calculator = require('./../../../../src/NoGame/Common/Area/Calculator');

describe("Area Calculator", () => {
    it("it calculates center position", () => {
        expect(Calculator.centerPosition(15, 11)).toEqual({x: 7, y: 5});
    });

    it("it calculates visible tiles range", () => {
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).startX).toEqual(43);
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).endX).toEqual(57);
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).startY).toEqual(45);
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).endY).toEqual(55);
    });
});