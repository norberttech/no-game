describe("Position", () => {
    const expect = require('expect.js');
    const Position = require('./../../../../../src/NoGame/Engine/Map/Area/Position');

    it ("can be compared with other positoon", () => {
        let position = new Position(10, 5);
        let samePosition = new Position(10, 5);
        let otherPosition = new Position(4, 6);

        expect(position.isEqualTo(samePosition)).to.be(true);
        expect(position.isEqualTo(otherPosition)).to.be(false);
    });

    it ("calculate distance to other position", () => {
        let position = new Position(1, 1);

        expect(position.calculateDistanceTo(new Position(1,0))).to.be(1);
        expect(position.calculateDistanceTo(new Position(2,0))).to.be(1.4);
        expect(position.calculateDistanceTo(new Position(3,1))).to.be(2);
        expect(position.calculateDistanceTo(new Position(3,0))).to.be(2.2);
        expect(position.calculateDistanceTo(new Position(3,3))).to.be(2.8);
        expect(position.calculateDistanceTo(new Position(2,4))).to.be(3.2);
    });
});