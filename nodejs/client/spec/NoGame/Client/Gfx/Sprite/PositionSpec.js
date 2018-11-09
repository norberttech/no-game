import Assert from 'assert-js';
import Position from './../../../../../src/NoGame/Client/Gfx/Sprite/Position';

describe("Gfx Size", () => {

    it("throws error when created from invalid values", () => {
        try {
            new Position(-1, 10);
        } catch (e) {
            Assert.equal(e, 'Expected value -1 to be greater than 0');
        }

        try {
            new new Position(0, 10);
        } catch (e) {
            Assert.equal(e, 'Expected value 0 to be greater than 0');
        }

        try {
            new Position(10, -1)
        } catch (e) {
            Assert.equal(e, 'Expected value -1 to be greater than 0');
        }

        try {
            new Position(10, 0)
        } catch (e) {
            Assert.equal(e, 'Expected value 0 to be greater than 0');
        }
    });
});