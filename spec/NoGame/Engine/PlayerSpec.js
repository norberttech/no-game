import Player from '../../../src/NoGame/Engine/Player';
import Position from '../../../src/NoGame/Engine/Map/Area/Position';

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

describe("Player", () => {
    it ("it has uuid", () => {
        let player = new Player("yaboomaster", 100);

        expect(player.id()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    it ("throws exception when more than one using setStartingPosition", () => {
        let player = new Player("yaboomaster", 100);

        player.setStartingPosition(new Position(1, 1));

        expect(() => {player.setStartingPosition(new Position(1, 1));})
            .toThrow("Starting position can be set only once, when player is spawned in area");
    });

    it ("throws exception on attempt to move for a distance more than 1 square", () => {
        let player = new Player("yaboomaster", 100);

        player.setStartingPosition(new Position(1, 1));

        expect(() => {player.move(new Position(1,3))})
            .toThrow("Can't move that far");
    });

    it ("moves to a different position", () => {
        let player = new Player("yaboomaster", 100);

        player.setStartingPosition(new Position(1, 1));

        player.move(new Position(1,2), 0);
        player.move(new Position(2,2), 0); // should not move here because is moving already
        expect(player.isMoving()).toBe(true);
        expect(player.currentPosition().isEqualTo(new Position(1,2))).toBe(true);

        sleep(600); // wait to finish move

        expect(player.isMoving()).toBe(false);
    });
});