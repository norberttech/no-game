import Monster from '../../../src/NoGame/Engine/Monster';
import Player from '../../../src/NoGame/Engine/Player';
import Position from '../../../src/NoGame/Engine/Map/Area/Position';
import Utils from '../../../src/NoGame/Common/Utils';

describe("Monster", () => {
    it ("it has uuid", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(monster.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it ("moves to a different position with delay between moves", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.move(new Position(1,2), 0);
        expect(monster.isMoving).toBe(true);
        monster.move(new Position(2,2), 0); // should not move here because is moving already
        expect(monster.position.isEqualTo(new Position(1,2))).toBe(true);

        Utils.sleep(600);

        expect(monster.isMoving).toBe(false);
    });

    it ("is not attacking by default", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(monster.isExhausted).toBe(false);
    });

    it ("is has attack delay", () => {
        let monster = new Monster("bobok", 100, 5, 10, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("yaboomaster", 100, 100);
        player.setStartingPosition(new Position(1, 2));

        monster.attack(player.id);

        expect(monster.isExhausted).toBe(false);

        monster.meleeDamage(player);

        expect(monster.isExhausted).toBe(true);

        Utils.sleep(10);

        expect(monster.isExhausted).toBe(false);
    });

    it ("it throws exception on damaging player that is not attacked by mosnter", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("yaboomaster", 100, 100);

        expect(() => {monster.meleeDamage(player)})
            .toThrow(`Player ${player.id} can't be damaged, it wasn't attacked by monster ${monster.id}`);
    });

    it ("it throws exception on damaging player that is too far from mosnter", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("yaboomaster", 100, 100);
        player.setStartingPosition(new Position(5, 5));

        monster.attack(player.id);

        expect(() => {monster.meleeDamage(player)})
            .toThrow(`Player ${player.id} can't be damaged, it is too far from monster ${monster.id}`);
    });

    it ("can't have negative health", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(200);

        expect(monster.health).toBe(0);
    });
});