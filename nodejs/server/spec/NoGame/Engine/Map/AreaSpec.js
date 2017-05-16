describe("Area", () => {
    const expect = require('expect.js');
    const Area = require('./../../../../src/NoGame/Engine/Map/Area');
    const Item = require('./../../../../src/NoGame/Engine/Map/Area/Item');
    const Tile = require('./../../../../src/NoGame/Engine/Map/Area/Tile');
    const Position = require('./../../../../src/NoGame/Engine/Map/Area/Position');
    const Player = require('./../../../../src/NoGame/Engine/Player');
    const TestKit = require('./../../Integration/TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        "use strict";

        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("can't have two tiles with the same position", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);
        let area = new Area("test area", 10, 10);

        area.addTile(grassTile);

        expect(() => {area.addTile(grassTile);})
            .to.throwError("Area \"test area\" already have a tile on position 0:0");
    });

    it ("can't take tile that position is out of area boundaries", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(25, 25), grass, stack);
        let area = new Area("test area", 10, 10);

        expect(() => {area.addTile(grassTile);})
            .to.throwError("Area \"test area\" boundaries are x: 10, y: 10. Tile position is 25:25");
    });

    it ("throws error on attempt to spawn same player twice", () => {
        let area = new Area("test area", 10, 10);
        let player = new Player("1111", "yaboomaster", 100, 100, clock, new Position(0, 0), new Position(0, 0));

        area.addTile(new Tile(new Position(0, 0), new Item(1)));

        area.loginPlayer(player);
        expect(() => {area.loginPlayer(player);})
            .to.throwError(`Player with id "${player.id}" is already present in area "test area"`);
    });

    it ("returns players except player with specific ID", () => {
        let grass = new Item(100);
        let stack = [new Item(2, true)];
        let grassTile = new Tile(new Position(1, 1), grass, stack);
        let area = new Area("test area", 1, 1);
        let player1 = new Player("111", "yaboo1", 100, 100, clock, new Position(1, 1), new Position(1, 1));
        let player2 = new Player("222", "yaboo2", 100, 100, clock, new Position(1, 1), new Position(1, 1));

        area.addTile(new Tile(new Position(0, 0), new Item(1)));
        area.addTile(grassTile);
        area.loginPlayer(player1);
        area.loginPlayer(player2);

        expect(area.visiblePlayersFor(player1.id)).to.eql([player2]);
    });

    it ("returns tiles visible by player", () => {
        let area = new Area("test area", 100, 100);
        let player = new Player("1111", "yaboo1", 100, 100, clock, new Position(50, 50), new Position(50, 50));
        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                area.addTile(new Tile(new Position(x, y), new Item(100)));
            }
        }

        area.loginPlayer(player);

        let tiles = area.visibleTilesFor(player.id);

        expect(tiles.length).to.be(221);
        expect(tiles[0].position.x).to.be(42);
        expect(tiles[0].position.y).to.be(44);

        expect(tiles[164].position.x).to.be(54);
        expect(tiles[164].position.y).to.be(52);
    });
});