describe("Area Calculator", () => {
    const Assert = require('assert-js');
    const Calculator = require('./../../../src/NoGame/Common/AreaCalculator');

    it("it calculates center position", () => {
        Assert.equal(Calculator.centerPosition(15, 11), {x: 7, y: 5});
    });

    it("it calculates visible tiles range", () => {
        Assert.equal(Calculator.visibleTilesRange(50, 50, 15, 11).startX, 43);
        Assert.equal(Calculator.visibleTilesRange(50, 50, 15, 11).endX, 57);
        Assert.equal(Calculator.visibleTilesRange(50, 50, 15, 11).startY, 45);
        Assert.equal(Calculator.visibleTilesRange(50, 50, 15, 11).endY, 55);
    });
});