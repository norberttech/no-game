import expect from 'expect.js';
import Size from './../../../../src/NoGame/Client/Gfx/Size';

describe("Gfx Size", () => {
    it("throws exception when created from invalid values", () => {
        expect(() => {new Size("string", 0)}).to.throwError('Expected integer but got "string["string"]".');
        expect(() => {new Size(10, "string")}).to.throwError('Expected integer but got "string["string"]".');
    });
});