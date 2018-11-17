describe("Tile", () => {
    const Assert = require('assert-js');
    const Item = require('./../../../../../src/NoGame/Engine/Map/Area/Item');
    const Tile = require('./../../../../../src/NoGame/Engine/Map/Area/Tile');
    const TileLayers = require('./../../../../../src/NoGame/Engine/Map/Area/TileLayers');
    const Position = require('./../../../../../src/NoGame/Engine/Map/Area/Position');

    it ("can be walked on when there are no blocking items on stack", () => {
        let grass = new Item(100);
        let grassTile = new Tile(new Position(0, 0), grass, new TileLayers(new Item(2), new Item(3), new Item(4)));

        Assert.true(grassTile.canWalkOn);
    });

    it ("can't be walked on when there is at least one blocking item on stack", () => {
        let grass = new Item(100);
        let tile = new Tile(
            new Position(0, 0),
            grass,
            new TileLayers(new Item(2), new Item(3), new Item(4, true))
        );

        Assert.false(tile.canWalkOn);
    });

    it ("can't be walked on when there is a monster on tile", () => {
        let grass = new Item(100);
        let grassTile = new Tile(new Position(0, 0), grass, new TileLayers(new Item(2), new Item(3), new Item(4)));

        grassTile.monsterWalkOn("12345677");

        Assert.false(grassTile.canWalkOn);
    });

    it ("can't be walked on when there is a player on tile", () => {
        let grass = new Item(100);
        let grassTile = new Tile(new Position(0, 0), grass, new TileLayers(new Item(2), new Item(3), new Item(4)));

        grassTile.playerWalkOn("12345677");

        Assert.false(grassTile.canWalkOn);
    });
});