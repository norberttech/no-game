import Spawn from '../../../src/NoGame/Engine/Spawn';
import MonsterFactory from '../../../src/NoGame/Engine/MonsterFactory';
import Position from '../../../src/NoGame/Engine/Map/Area/Position';

describe("Spawn", () => {
    let monsterFactory = new MonsterFactory();
    monsterFactory.addTemplate("rat", 1, 100);

    it("it knows when its full", () => {
        let spawn = new Spawn("rat", 1, 1000, new Position(20, 20), 10);

        spawn.spawnMonster(monsterFactory, spawn.randomPosition);

        expect(() => {spawn.spawnMonster(monsterFactory, spawn.randomPosition);})
            .toThrow(`Spawn ${spawn.id} for "${spawn.monsterName}" is full.`);
    });

    it("it throws exception when not ready to spawn new monster", () => {
        let spawn = new Spawn("rat", 10, 1000, new Position(20, 20), 10);

        spawn.spawnMonster(monsterFactory, spawn.randomPosition);

        expect(() => {spawn.spawnMonster(monsterFactory, spawn.randomPosition);})
            .toThrow(`Spawn ${spawn.id} for "${spawn.monsterName}" is not ready for new monster yet.`);
    });

    it("is not full by default", () => {
        let spawn = new Spawn("rat", 1, 1000, new Position(20, 20), 10);

        expect(spawn.isFull).toBe(false);
    });
});