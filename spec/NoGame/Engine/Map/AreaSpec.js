import Area from '../../../../src/NoGame/Engine/Map/Area';
import Item from '../../../../src/NoGame/Engine/Map/Area/Item';
import Tile from '../../../../src/NoGame/Engine/Map/Area/Tile';
import Position from '../../../../src/NoGame/Engine/Map/Area/Position';
import Player from '../../../../src/NoGame/Engine/Player';

describe("Area", () => {
    it ("can't have two tiles with the same position", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);
        let area = new Area("test area", 10, 10);

        area.addTile(grassTile);

        expect(() => {area.addTile(grassTile);})
            .toThrow("Area \"test area\" already have a tile on position 0:0");
    });

    it ("can't take tile that position is out of area boundaries", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(25, 25), grass, stack);
        let area = new Area("test area", 10, 10);

        expect(() => {area.addTile(grassTile);})
            .toThrow("Area \"test area\" boundaries are x: 10, y: 10. Tile position is 25:25");
    });

    it ("throws error on attempt to spawn same player twice", () => {
        let area = new Area("test area", 10, 10);
        let player = new Player("yaboomaster", 100);

        area.spawnPlayer(player);
        expect(() => {area.spawnPlayer(player);})
            .toThrow(`Player with id "${player.id()}" is already present in area "test area"`);
    });

    it ("throws error on attempt to move player to position without tile", () => {
        let area = new Area("test area", 10, 10);
        let player = new Player("yaboomaster", 100);

        area.spawnPlayer(player);
        expect(() => {area.movePlayerTo(player.id(), new Position(1,1))})
            .toThrow(`There is no tile on position 1:1`);
    });

    it ("throws error on attempt to move player to position where tile is not walkable", () => {
        let grass = new Item(100);
        let stack = [new Item(2, true)];
        let grassTile = new Tile(new Position(1, 1), grass, stack);
        let area = new Area("test area", 1, 1);
        let player = new Player("yaboomaster", 100);

        area.addTile(grassTile);
        area.spawnPlayer(player);

        expect(() => {area.movePlayerTo(player.id(), new Position(1,1))})
            .toThrow(`Can't walk on tile on 1:1`);
    });

    it ("returns players except player with specific ID", () => {
        let grass = new Item(100);
        let stack = [new Item(2, true)];
        let grassTile = new Tile(new Position(1, 1), grass, stack);
        let area = new Area("test area", 1, 1);
        let player1 = new Player("yaboo1", 100);
        let player2 = new Player("yaboo2", 100);

        area.addTile(grassTile);
        area.spawnPlayer(player1);
        area.spawnPlayer(player2);

        expect(area.visiblePlayersFor(player1.id())).toEqual([player2]);
    });

    it ("throws error when visible tiles sizes are not odd", () => {
        let area = new Area("test area", 100, 100);
        let player = new Player("yaboo1", 100);
        area.spawnPlayer(player);

        expect(() => {area.visibleTilesFor(player.id(), 6, 7);})
            .toThrow(`Expected odd number but got "int[6]".`);
        expect(() => {area.visibleTilesFor(player.id(), 15, 4);})
            .toThrow(`Expected odd number but got "int[4]".`);
    });

    it ("returns tiles visible by player", () => {
        let area = new Area("test area", 100, 100);
        let player = new Player("yaboo1", 100);
        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                area.addTile(new Tile(new Position(x, y), new Item(100)));
            }
        }
        area.changeSpawnPosition(new Position(50, 50));
        area.spawnPlayer(player);

        let tiles = area.visibleTilesFor(player.id(), 15, 11);

        expect(tiles.length).toBe(165);
        expect(tiles[0].position().x()).toBe(43);
        expect(tiles[0].position().y()).toBe(45);

        expect(tiles[164].position().x()).toBe(57);
        expect(tiles[164].position().y()).toBe(55);
    });
});