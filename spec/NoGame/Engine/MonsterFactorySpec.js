import MonsterFactory from '../../../src/NoGame/Engine/MonsterFactory';
import Position from '../../../src/NoGame/Engine/Map/Area/Position';

describe("Monster Factory", () => {
    it("it creates monster from template", () => {
        let factory = new MonsterFactory();
        factory.addTemplate('rat', 1, 100);

        let monster = factory.create('rat', new Position(0, 0));

        expect(monster.health).toBe(100);
        expect(monster.spriteId).toBe(1);
        expect(monster.name).toBe("rat");
    });

    it("throws exception when there is no template for a monster", () => {
        let factory = new MonsterFactory();

        expect(() => {factory.create("rat", new Position(1, 1));})
            .toThrow(`Monster "rat" does not have valid template.`);
    });
});