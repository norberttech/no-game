describe("Area", () => {
    const Assert = require('assert-js');
    const Area = require('./../../../../src/NoGame/Engine/Map/Area');
    const Item = require('./../../../../src/NoGame/Engine/Map/Area/Item');
    const Tile = require('./../../../../src/NoGame/Engine/Map/Area/Tile');
    const TileLayers = require('./../../../../src/NoGame/Engine/Map/Area/TileLayers');
    const Position = require('./../../../../src/NoGame/Engine/Map/Area/Position');
    const Player = require('./../../../../src/NoGame/Engine/Player');
    const TestKit = require('../../TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        "use strict";

        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("can't have two tiles with the same position", () => {
        let grass = new Item(100);
        let tileLayers = new TileLayers(new Item(2), new Item(3), new Item(4));
        let grassTile = new Tile(new Position(0, 0), grass, tileLayers);
        let area = new Area("test area", 10, 10);

        area.addTile(grassTile);

        try {
            area.addTile(grassTile);
        } catch (e) {
            Assert.equal(e.toString(), "Area \"test area\" already have a tile on position 0:0");
        }
    });

    it ("can't take tile that position is out of area boundaries", () => {
        let grass = new Item(100);
        let tileLayers = new TileLayers(new Item(2), new Item(3), new Item(4));
        let grassTile = new Tile(new Position(25, 25), grass, tileLayers);
        let area = new Area("test area", 10, 10);

        try {
            area.addTile(grassTile);
        } catch (e) {
            Assert.equal(e.toString(), "Area \"test area\" boundaries are x: 10, y: 10. Tile position is 25:25");
        }
    });

    it ("throws error on attempt to spawn same player twice", () => {
        let area = new Area("test area", 10, 10);
        let player = new Player("1111", "yaboomaster", 100, 100, new Position(0, 0), new Position(0, 0));

        area.addTile(new Tile(new Position(0, 0), new Item(1), new TileLayers()));

        area.loginPlayer(player);

        try {
            area.loginPlayer(player);
        } catch (e) {
            Assert.equal(e.toString(), `Player with id "${player.id}" is already present in area "test area"`);
        }
    });

    it ("returns players except player with specific ID", () => {
        let grass = new Item(100);
        let tileLayers = new TileLayers(new Item(2, true));
        let grassTile = new Tile(new Position(1, 1), grass, tileLayers);
        let area = new Area("test area", 1, 1);
        let player1 = new Player("111", "yaboo1", 100, 100, new Position(1, 1), new Position(1, 1));
        let player2 = new Player("222", "yaboo2", 100, 100, new Position(1, 1), new Position(1, 1));

        area.addTile(new Tile(new Position(0, 0), new Item(1), new TileLayers()));
        area.addTile(grassTile);
        area.loginPlayer(player1);
        area.loginPlayer(player2);

        Assert.equal(area.visiblePlayersFor(player1.id)[0].id, player2.id);
    });

    it ("returns tiles visible by player", () => {
        let area = new Area("test area", 100, 100);
        let player = new Player("1111", "yaboo1", 100, 100, new Position(50, 50), new Position(50, 50));
        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                area.addTile(new Tile(new Position(x, y), new Item(100), new TileLayers()));
            }
        }

        area.loginPlayer(player);

        let tiles = area.visibleTilesFor(player.id);

        Assert.equal(tiles.length, 255);
        Assert.equal(tiles[0].position.x, 42);
        Assert.equal(tiles[0].position.y, 43);

        Assert.equal(tiles[164].position.x, 52);
        Assert.equal(tiles[164].position.y ,57);
    });
});