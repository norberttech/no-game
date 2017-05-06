describe("Item", () => {
    const expect = require('expect.js');
    const Item = require('./../../../../../src/NoGame/Engine/Map/Area/Item');

    it ("is not blocking by default", () => {
        let item = new Item(12345);

        expect(item.isBlocking).to.be(false);
    });
});