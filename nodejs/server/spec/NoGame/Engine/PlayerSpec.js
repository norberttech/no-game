describe("Player", () => {
    const expect = require('expect.js');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const Utils = require('./../../../src/NoGame/Common/Utils');
    const TestKit = require('./../Integration/TestKit/TestKit');

    let clock = null;

    beforeEach(() => {
        "use strict";

        clock = new TestKit.ManualClock(new Date().getTime());
    });

    it ("it has uuid", () => {
        let player = new Player("yaboomaster", 100, 100, clock);

        expect(player.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it ("throws exception when more than one using setStartingPosition", () => {
        let player = new Player("yaboomaster", 100, 100, clock);

        player.setStartingPosition(new Position(1, 1));

        expect(() => {player.setStartingPosition(new Position(1, 1));})
            .to.throwError("Starting position can be set only once, when player is spawned in area");
    });

    it ("throws exception on attempt to move for a distance more than 1 square", () => {
        let player = new Player("yaboomaster", 100, 100, clock);

        player.setStartingPosition(new Position(1, 1));

        expect(() => {
            player.move(new Tile(new Position(1,3), new Item(0, false)));
        }).to.throwError("Can't move that far");
    });

    it ("moves to a different position with delay between moves", () => {
        let player = new Player("yaboomaster", 100, 100, clock);

        player.setStartingPosition(new Position(1, 1));

        player.move(new Tile(new Position(1,2), new Item(0, false)));
        player.move(new Tile(new Position(2,2), new Item(0, false))); // should not move here because is moving already
        expect(player.isMoving).to.be(true);
        expect(player.position.isEqualTo(new Position(1,2))).to.be(true);

        clock.pushForward(600);

        expect(player.isMoving).to.be(false);
    });

    it ("can't have negative health", () => {
        let player = new Player("yaboomaster", 100, 100, clock);

        player.damage(200);

        expect(player.health).to.be(0);
    });
});