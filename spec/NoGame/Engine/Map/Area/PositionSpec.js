import Position from '../../../../../src/NoGame/Engine/Map/Area/Position'

describe("Position", () => {
    it ("can be compared with other positoon", () => {
        let position = new Position(10, 5);
        let samePosition = new Position(10, 5);
        let otherPosition = new Position(4, 6);

        expect(position.isEqualTo(samePosition)).toBe(true);
        expect(position.isEqualTo(otherPosition)).toBe(false);
    });

    it ("calculate distance to other position", () => {
        let position = new Position(1, 1);

        expect(position.calculateDistanceTo(new Position(1,0))).toBe(1);
        expect(position.calculateDistanceTo(new Position(2,0))).toBe(1.4);
        expect(position.calculateDistanceTo(new Position(3,1))).toBe(2);
        expect(position.calculateDistanceTo(new Position(3,0))).toBe(2.2);
        expect(position.calculateDistanceTo(new Position(3,3))).toBe(2.8);
        expect(position.calculateDistanceTo(new Position(2,4))).toBe(3.2);
    });
});