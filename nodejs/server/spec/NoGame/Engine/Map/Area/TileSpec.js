describe("Tile", () => {
    const Assert = require('assert-js');
    const Item = require('./../../../../../src/NoGame/Engine/Map/Area/Item');
    const Tile = require('./../../../../../src/NoGame/Engine/Map/Area/Tile');
    const Position = require('./../../../../../src/NoGame/Engine/Map/Area/Position');

    it ("can be walked on when there are no blocking items on stack", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        Assert.true(grassTile.canWalkOn);
    });

    it ("can't be walked on when there is at least one blocking item on stack", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4, true)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        Assert.false(grassTile.canWalkOn);
    });

    it ("can't be walked on when there is a monster on tile", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        grassTile.monsterWalkOn("12345677");

        Assert.false(grassTile.canWalkOn);
    });

    it ("can't be walked on when there is a player on tile", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        grassTile.playerWalkOn("12345677");

        Assert.false(grassTile.canWalkOn);
    });
});