import expect from 'expect.js';
import Position from './../../../../../src/NoGame/Client/Gfx/Sprite/Position';

describe("Gfx Size", () => {

    it("throws error when created from invalid values", () => {
        expect(() => {new Position(-1, 10)}).to.throwError('Expected value -1 to be greater than 0');
        expect(() => {new Position(0, 10)}).to.throwError('Expected value 0 to be greater than 0');

        expect(() => {new Position(10, -1)}).to.throwError('Expected value -1 to be greater than 0');
        expect(() => {new Position(10, 0)}).to.throwError('Expected value 0 to be greater than 0');

        expect(() => {new Position("string", 0)}).to.throwError('Expected number but got "string["string"]".');
        expect(() => {new Position(10, "string")}).to.throwError('Expected number but got "string["string"]".');
    });
});