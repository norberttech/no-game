import Calculator from '../../../../src/NoGame/Common/Area/Calculator';

describe("Area Calculator", () => {
    it("it calculates center position", () => {
        expect(Calculator.centerPosition(15, 11)).toEqual({x: 7, y: 5});
    });

    it("it calculates visible tiles range", () => {
        expect(Calculator.visibleTilesRange(50, 50, 15, 11)).toEqual({
            x: {
                start: 43,
                end: 57
            },
            y: {
                start: 45,
                end: 55
            }
        });
    });
});