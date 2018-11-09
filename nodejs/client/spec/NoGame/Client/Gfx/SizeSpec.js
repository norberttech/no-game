import Size from './../../../../src/NoGame/Client/Gfx/Size';
import Assert from "assert-js";

describe("Gfx Size", () => {
    it("throws exception when created from invalid values", () => {
        try {
            new Size("string", 0);
        } catch (e) {
            Assert.equal(e.toString(), 'Error: Expected integer but got "string["string"]".');
        }

        try {
            new Size(10, "string");
        } catch (e) {
            Assert.equal(e.toString(), 'Error: Expected integer but got "string["string"]".');
        }
    });
});