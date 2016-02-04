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
            .toThrow("Area \"test area\" already have a tile on position x: 0, y: 0");
    });

    it ("can't take tile that position is out of area boundaries", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(25, 25), grass, stack);
        let area = new Area("test area", 10, 10);

        expect(() => {area.addTile(grassTile);})
            .toThrow("Area \"test area\" boundaries are x: 10, y: 10. Tile position is x: 25, y: 25");
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
            .toThrow(`There is no tile on position x: 1, y: 1`);
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
            .toThrow(`Can't walk on tile on x: 1, y: 1`);
    });
});