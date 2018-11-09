const Size = require('./../../../../src/NoGame/Client/Gfx/Size');
const Assert = require("assert-js");

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