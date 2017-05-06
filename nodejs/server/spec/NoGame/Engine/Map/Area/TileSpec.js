describe("Tile", () => {
    const expect = require('expect.js');
    const Item = require('./../../../../../src/NoGame/Engine/Map/Area/Item');
    const Tile = require('./../../../../../src/NoGame/Engine/Map/Area/Tile');
    const Position = require('./../../../../../src/NoGame/Engine/Map/Area/Position');
    const Monster = require('./../../../../../src/NoGame/Engine/Monster');
    const Player = require('./../../../../../src/NoGame/Engine/Player');

    it ("can be walked on when there are no blocking items on stack", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        expect(grassTile.canWalkOn).to.be(true);
    });

    it ("can't be walked on when there is at least one blocking item on stack", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4, true)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        expect(grassTile.canWalkOn).to.be(false);
    });

    it ("can't be walked on when there is a monster on tile", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        grassTile.monsterWalkOn("12345677");

        expect(grassTile.canWalkOn).to.be(false);
    });

    it ("can't be walked on when there is a player on tile", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        grassTile.playerWalkOn("12345677");

        expect(grassTile.canWalkOn).to.be(false);
    });
});