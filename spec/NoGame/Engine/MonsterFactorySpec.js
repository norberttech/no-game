'use strict';

const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');

describe("Monster Factory", () => {
    it("it creates monster from template", () => {
        let factory = new MonsterFactory();
        factory.addTemplate('rat', 1, 100, 5, 500, 5);

        let monster = factory.create('rat', new Position(0, 0), "123123123");

        expect(monster.health).toBe(100);
        expect(monster.spriteId).toBe(1);
        expect(monster.name).toBe("rat");
    });

    it("throws exception when there is no template for a monster", () => {
        let factory = new MonsterFactory();

        expect(() => {factory.create("bobok", new Position(1, 1), "123123123");})
            .toThrow(`Monster "bobok" does not have valid template.`);
    });
});