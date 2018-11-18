describe("Monster", () => {
    const Assert = require('assert-js');
    const Monster = require('./../../../src/NoGame/Engine/Monster');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const TileLayers = require('./../../../src/NoGame/Engine/Map/Area/TileLayers');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const TestKit = require('../TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("it has uuid", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        Assert.uuid(monster.id);
    });

    it ("moves to a different position with delay between moves", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.move(new Tile(new Position(1,2), new Item(0, false), new TileLayers()), clock);
        Assert.true(monster.isMoving(clock));
        monster.move(new Tile(new Position(2,2), new Item(0, false), new TileLayers()), clock); // should not move here because is moving already
        Assert.true(monster.position.isEqualTo(new Position(1, 2)));

        clock.pushForward(600);

        Assert.false(monster.isMoving(clock));
    });

    it ("is not attacking by default", () => {
        let mon = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        Assert.false(mon.isExhausted(clock));
    });

    it ("is has attack delay", () => {
        let monster = new Monster("bobok", 100, 5, 50, 10, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("1111", "yaboomaster", 100, 100, new Position(1, 2), new Position(1, 2));

        monster.attack(player.id);

        Assert.false(monster.isExhausted(clock));

        monster.meleeHit(10, clock, new TestKit.ManualRandomizer(1));

        Assert.true(monster.isExhausted(clock));

        clock.pushForward(100);

        Assert.false(monster.isExhausted(clock));
    });

    it ("can't have negative health", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(200, '111111');

        Assert.equal(monster.health, 0);
        Assert.equal(monster.killerId, '111111');
    });

    it ("don't have killer when is not dead", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(20, '111111');

        try {
            monster.killerId;
        } catch (e) {
            Assert.equal(e.toString(), 'Error: Monster is not dead.');
        }
    });

    it ("have only one killer with highest damage", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(20, '111111');
        monster.damage(20, '222222');
        monster.damage(20, '222222');
        monster.damage(20, '222222');
        monster.damage(20, '111111');

        Assert.equal(monster.killerId, '222222');
    });

    it ("counts last highest hit as a killer", () => {
        let monster = new Monster("bobok", 100, 5, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(50, '111111');
        monster.damage(50, '222222');

        Assert.equal(monster.killerId, '222222');
    });

    it ("calculate damage for defence", () => {
        let monster = new Monster("bobok", 100, 5, 20, 500, 5, 1, new Position(1, 1), "1234556789");

        Assert.equal(monster.meleeHit(10, clock, new TestKit.ManualRandomizer(1)), 10);
    });
});