describe("Monster Factory", () => {
    const expect = require('expect.js');
    const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const TestKit = require('./../Integration/TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it("it creates monster from template", () => {
        let factory = new MonsterFactory(clock);
        factory.addTemplate('rat', 1, 100, 5, 500, 5);

        let monster = factory.create('rat', new Position(0, 0), "123123123");

        expect(monster.health).to.be(100);
        expect(monster.spriteId).to.be(1);
        expect(monster.name).to.be("rat");
    });

    it("throws exception when there is no template for a monster", () => {
        let factory = new MonsterFactory(clock);

        expect(() => {factory.create("bobok", new Position(1, 1), "123123123");})
            .to.throwError(`Monster "bobok" does not have valid template.`);
    });
});