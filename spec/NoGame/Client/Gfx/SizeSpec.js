import Size from '../../../../src/NoGame/Client/Gfx/Size'

describe("Gfx Size", () => {
    it("throws exception when created from invalid values", () => {
        expect(() => {new Size("string", 0)}).toThrow('Expected integer but got "string["string"]".');
        expect(() => {new Size(10, "string")}).toThrow('Expected integer but got "string["string"]".');
    });
});