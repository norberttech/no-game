describe("Item", () => {
    const Assert = require('assert-js');
    const Item = require('./../../../../../src/NoGame/Engine/Map/Area/Item');

    it ("is not blocking by default", () => {
        let item = new Item(12345);

        Assert.false(item.isBlocking);
    });
});