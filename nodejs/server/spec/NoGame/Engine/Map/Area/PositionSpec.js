describe("Position", () => {
    const Assert = require('assert-js');
    const Position = require('./../../../../../src/NoGame/Engine/Map/Area/Position');

    it ("can be compared with other positoon", () => {
        let position = new Position(10, 5);
        let samePosition = new Position(10, 5);
        let otherPosition = new Position(4, 6);

        Assert.true(position.isEqualTo(samePosition));
        Assert.false(position.isEqualTo(otherPosition));
    });

    it ("calculate distance to other position", () => {
        let position = new Position(1, 1);

        Assert.equal(position.calculateDistanceTo(new Position(1,0)), 1);
        Assert.equal(position.calculateDistanceTo(new Position(2,0)), 1.4);
        Assert.equal(position.calculateDistanceTo(new Position(3,1)), 2);
        Assert.equal(position.calculateDistanceTo(new Position(3,0)), 2.2);
        Assert.equal(position.calculateDistanceTo(new Position(3,3)), 2.8);
        Assert.equal(position.calculateDistanceTo(new Position(2,4)), 3.2);
    });
});