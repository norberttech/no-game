describe("Area Calculator", () => {
    const expect = require('expect.js');
    const Calculator = require('./../../../src/NoGame/Common/AreaCalculator');

    it("it calculates center position", () => {
        expect(Calculator.centerPosition(15, 11)).to.eql({x: 7, y: 5});
    });

    it("it calculates visible tiles range", () => {
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).startX).to.eql(43);
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).endX).to.eql(57);
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).startY).to.eql(45);
        expect(Calculator.visibleTilesRange(50, 50, 15, 11).endY).to.eql(55);
    });
});