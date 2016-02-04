import Item from '../../../../../src/NoGame/Engine/Map/Area/Item'

describe("Item", () => {
    it ("is not blocking by default", () => {
        let item = new Item(12345);

        expect(item.isBlocking()).toBe(false);
    });
});