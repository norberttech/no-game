import Item from '../../../../../src/NoGame/Engine/Map/Area/Item'
import Tile from '../../../../../src/NoGame/Engine/Map/Area/Tile'
import Position from '../../../../../src/NoGame/Engine/Map/Area/Position'
import Monster from '../../../../../src/NoGame/Engine/Monster'
import Player from '../../../../../src/NoGame/Engine/Player'

describe("Tile", () => {
    it ("can be walked on when there are no blocking items on stack", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        expect(grassTile.canWalkOn()).toBe(true);
    });

    it ("can't be walked on when there is at least one blocking item on stack", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4, true)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        expect(grassTile.canWalkOn()).toBe(false);
    });

    it ("can't be walked on when there is a monster on tile", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        grassTile.monsterWalkOn("12345677");

        expect(grassTile.canWalkOn()).toBe(false);
    });

    it ("can't be walked on when there is a player on tile", () => {
        let grass = new Item(100);
        let stack = [new Item(2), new Item(3), new Item(4)];
        let grassTile = new Tile(new Position(0, 0), grass, stack);

        grassTile.playerWalkOn("12345677");

        expect(grassTile.canWalkOn()).toBe(false);
    });
});