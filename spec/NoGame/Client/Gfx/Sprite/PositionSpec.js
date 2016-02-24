import Position from '../../../../../src/NoGame/Client/Gfx/Sprite/Position'

describe("Gfx Size", () => {
    it("throws error when created from invalid values", () => {
        expect(() => {new Position(-1, 10)}).toThrow('Expected value -1 to be greater than 0');
        expect(() => {new Position(0, 10)}).toThrow('Expected value 0 to be greater than 0');

        expect(() => {new Position(10, -1)}).toThrow('Expected value -1 to be greater than 0');
        expect(() => {new Position(10, 0)}).toThrow('Expected value 0 to be greater than 0');

        expect(() => {new Position("string", 0)}).toThrow('Expected number but got "string["string"]".');
        expect(() => {new Position(10, "string")}).toThrow('Expected number but got "string["string"]".');
    });
});