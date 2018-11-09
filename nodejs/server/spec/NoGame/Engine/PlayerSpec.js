describe("Player", () => {
    const Assert = require('assert-js');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Monster = require('./../../../src/NoGame/Engine/Monster');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const Utils = require('./../../../../common/src/NoGame/Common/Utils');
    const TestKit = require('../TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("throws exception on attempt to move for a distance more than 1 square", () => {
        let player = new Player("1111", "yaboomaster", 100, 100, new Position(1, 1), new Position(1, 1));

        try {
            player.move(new Tile(new Position(1,3), new Item(0, false)), clock);
        } catch (e) {
            Assert.equal(e.toString(), "Can't move that far");
        }
    });

    it ("moves to a different position with delay between moves", () => {
        let player = new Player("1111", "yaboomaster", 100, 100, new Position(1, 1), new Position(1, 1));


        player.move(new Tile(new Position(1,2), new Item(0, false)), clock);
        player.move(new Tile(new Position(2,2), new Item(0, false)), clock); // should not move here because is moving already
        Assert.true(player.isMoving(clock));
        Assert.true(player.position.isEqualTo(new Position(1,2)));

        clock.pushForward(600);

        Assert.false(player.isMoving(clock));
    });

    it ("is has attack delay", () => {
        let monster = new Monster("bobok", 100, 5, 50, 10, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("1111", "yaboomaster", 100, 100, new Position(1, 2), new Position(1, 2));

        player.attackMonster(monster.id);

        Assert.false(player.isExhausted(clock));

        player.meleeHit(10, clock, new TestKit.ManualRandomizer(1));

        Assert.true(player.isExhausted(clock));

        clock.pushForward(3000);

        Assert.false(player.isExhausted(clock));
    });

    it ("can't have negative health", () => {
        let player = new Player("11111", "yaboomaster", 100, 100, new Position(1, 1), new Position(1, 1));

        player.damage(200);

        Assert.equal(player.health, 0);
    });

    it ("calculate damage for defence using randomizer", () => {
        let player = new Player("11111", "yaboomaster", 100, 100, new Position(1, 1), new Position(1, 1));

        Assert.equal(player.meleeHit(10, clock, new TestKit.ManualRandomizer(1)), 10);
    });

    it ("advance after earning enough experience", () => {
        let player = new Player("11111", "yaboomaster", 100, 100, new Position(1, 1), new Position(1, 1));

        player.earnExperience(100, new TestKit.ExperienceCalculator());

        Assert.equal(player.level, 2);
    });

    it ("loss experience when die", () => {
        let player = new Player("11111", "yaboomaster", 100, 100, new Position(1, 1), new Position(1, 1));
        player.earnExperience(100, new TestKit.ExperienceCalculator());

        player.die(new TestKit.ExperienceCalculator());

        Assert.equal(player.level, 1);
    });
});