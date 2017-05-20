describe("Player", () => {
    const expect = require('expect.js');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Monster = require('./../../../src/NoGame/Engine/Monster');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const Utils = require('./../../../../common/src/NoGame/Common/Utils');
    const TestKit = require('./../Integration/TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("throws exception on attempt to move for a distance more than 1 square", () => {
        let player = new Player("1111", "yaboomaster", 0, 100, 100, clock, new Position(1, 1), new Position(1, 1));

        expect(() => {
            player.move(new Tile(new Position(1,3), new Item(0, false)));
        }).to.throwError("Can't move that far");
    });

    it ("moves to a different position with delay between moves", () => {
        let player = new Player("1111", "yaboomaster", 0, 100, 100, clock, new Position(1, 1), new Position(1, 1));


        player.move(new Tile(new Position(1,2), new Item(0, false)));
        player.move(new Tile(new Position(2,2), new Item(0, false))); // should not move here because is moving already
        expect(player.isMoving).to.be(true);
        expect(player.position.isEqualTo(new Position(1,2))).to.be(true);

        clock.pushForward(600);

        expect(player.isMoving).to.be(false);
    });

    it ("is has attack delay", () => {
        let monster = new Monster("bobok", 100, 50, 10, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("1111", "yaboomaster", 0, 100, 100, clock, new Position(1, 2), new Position(1, 2));

        player.attackMonster(monster.id);

        expect(player.isExhausted).to.be(false);

        player.meleeHit(10);

        expect(player.isExhausted).to.be(true);

        clock.pushForward(3000);

        expect(player.isExhausted).to.be(false);
    });

    it ("can't have negative health", () => {
        let player = new Player("11111", "yaboomaster", 0, 100, 100, clock, new Position(1, 1), new Position(1, 1));

        player.damage(200);

        expect(player.health).to.be(0);
    });
});