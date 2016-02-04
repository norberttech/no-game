import Size from '../../../../src/NoGame/Client/Gfx/Size'

describe("Gfx Size", () => {
    it("throws exception when created from invalid values", () => {
        expect(() => {new Size(-1, 10)}).toThrow('Expected value -1 to be greater than 0');
        expect(() => {new Size(0, 10)}).toThrow('Expected value 0 to be greater than 0');

        expect(() => {new Size(10, -1)}).toThrow('Expected value -1 to be greater than 0');
        expect(() => {new Size(10, 0)}).toThrow('Expected value 0 to be greater than 0');

        expect(() => {new Size("string", 0)}).toThrow('Expected integer value, got string');
        expect(() => {new Size(10, "string")}).toThrow('Expected integer value, got string');
    });
});