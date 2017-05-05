describe("Monster", () => {
    const expect = require('expect.js');
    const Monster = require('./../../../src/NoGame/Engine/Monster');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const Utils = require('./../../../src/NoGame/Common/Utils');

    it ("it has uuid", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(monster.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it ("moves to a different position with delay between moves", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.move(new Tile(new Position(1,2), new Item(0, false)));
        expect(monster.isMoving).to.be(true);
        monster.move(new Tile(new Position(2,2), new Item(0, false))); // should not move here because is moving already
        expect(monster.position.isEqualTo(new Position(1, 2))).to.be(true);

        Utils.sleep(600);

        expect(monster.isMoving).to.be(false);
    });

    it ("is not attacking by default", () => {
        let mon = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        expect(mon.isExhausted).to.be(false);
    });

    it ("is has attack delay", () => {
        let monster = new Monster("bobok", 100, 5, 10, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("yaboomaster", 100, 100);
        player.setStartingPosition(new Position(1, 2));

        monster.attack(player.id);

        expect(monster.isExhausted).to.be(false);

        monster.meleeDamage(player);

        expect(monster.isExhausted).to.be(true);

        Utils.sleep(100);

        expect(monster.isExhausted).to.be(false);
    });

    it ("it throws exception on damaging player that is not attacked by mosnter", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("yaboomaster", 100, 100);

        expect(() => {monster.meleeDamage(player)})
            .to.throwError(`Player ${player.id} can't be damaged, it wasn't attacked by monster ${monster.id}`);
    });

    it ("it throws exception on damaging player that is too far from mosnter", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");
        let player = new Player("yaboomaster", 100, 100);
        player.setStartingPosition(new Position(5, 5));

        monster.attack(player.id);

        expect(() => {monster.meleeDamage(player)})
            .to.throwError(`Player ${player.id} can't be damaged, it is too far from monster ${monster.id}`);
    });

    it ("can't have negative health", () => {
        let monster = new Monster("bobok", 100, 5, 500, 5, 1, new Position(1, 1), "1234556789");

        monster.damage(200);

        expect(monster.health).to.be(0);
    });
});