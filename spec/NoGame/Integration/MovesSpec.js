'use strict';

const Kernel = require('./../../../src/NoGame/Engine/Kernel');
const Server = require('./../../../src/NoGame/Server/Server');
const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
const MemoryLogger = require('./../../../src/NoGame/Infrastructure/Logger/MemoryLogger');
const TestKit = require('./TestKit/TestKit');

const PORT = 3333;
const HOST = `ws://127.0.0.1:${PORT}`;

describe("Server - Moves -", () => {
    let server;
    let player;

    beforeEach((done) =>
    {
        let area = TestKit.AreaFactory.emptyWalkable(3, 3);
        area.changeSpawnPosition(new Position(1, 1));
        let logger = new MemoryLogger();
        let kernel = new Kernel(logger, area, new MonsterFactory());
        kernel.boot();

        server = new Server(kernel, logger);
        server.listen(PORT, () => {
            player = new TestKit.Player();
            player.connect(HOST, () => {
                player.send(TestKit.MessageFactory.authenticate('test'));

                player.expectMsg((message) => {
                    TestKit.MessageAssert.batchString(message);
                    done(); // player logged in, testsuite can proceed
                })
            });
        });
    });

    it("disconnects when trying to move as not logged in player", (done) => {
        let hacker = new TestKit.Player();

        hacker.connect(HOST, () => {
            hacker.send(TestKit.MessageFactory.move(3, 1));
            hacker.expectDisconnection(() => {
                done();
            });
        });
    });

    it("allows to move east", (done) => {
        testMove(player, 2, 1, 500, done);
    });

    it("allows to move west", (done) => {
        testMove(player, 0, 1, 500, done);
    });

    it("allows to move north", (done) => {
        testMove(player, 1, 0, 500, done);
    });

    it("allows to move north", (done) => {
        testMove(player, 0, 1, 500, done);
    });

    it("allows to move north east", (done) => {
        testMove(player, 2, 0, 700, done);
    });

    it("allows to move north west", (done) => {
        testMove(player, 0, 0, 700, done);
    });

    it("allows to move south west", (done) => {
        testMove(player, 0, 2, 700, done);
    });

    it("allows to move south east", (done) => {
        testMove(player, 2, 2, 700, done);
    });

    it("makes sure that players can't jump", (done) => {
        player.send(TestKit.MessageFactory.move(3, 1));

        player.expectMsg((message) => {
            TestKit.MessageAssert.moveString(message).assertX(1).assertY(1).assertMoveTime(0);
            done();
        })
    });

    it("makes sure that players can't move too fast", (done) => {
        testMove(player, 2, 1, 500);
        player.send(TestKit.MessageFactory.move(2, 2));

        player.expectMsg((message) => {
            TestKit.MessageAssert.batchString(message);

            let messages = TestKit.MessageParser.parseBatch(message);

            TestKit.MessageAssert.moveObject(messages[0]).assertX(2).assertY(1);
            TestKit.MessageAssert.tilesObject(messages[1]);
            TestKit.MessageAssert.charactersObject(messages[2]);

            done();
        })
    });

    it("sends opponents moves to player", (done) => {
        let opponent = new TestKit.Player();

        opponent.connect(HOST, () => {
            opponent.send(TestKit.MessageFactory.authenticate('opponent'));

            opponent.expectMsg((message) => {
                TestKit.MessageAssert.batchString(message);

                opponent.send(TestKit.MessageFactory.move(2, 1));

                player.expectMsg((message) => {
                    TestKit.MessageAssert.charactersString(message);
                    done();
                })
            });
        });
    });

    afterEach((done) => {
        player.disconnect();
        server.terminate(() => done());
    });
});

/**
 * @param {Player} player
 * @param {int} x
 * @param {int} y
 * @param {int} moveTime
 * @param {function} [done]
 */
function testMove(player, x, y, moveTime, done = () => {})
{
    player.send(TestKit.MessageFactory.move(x, y));

    player.expectMsg((message) => {
        TestKit.MessageAssert.batchString(message);

        let messages = TestKit.MessageParser.parseBatch(message);

        TestKit.MessageAssert.moveObject(messages[0]).assertX(x).assertY(y).assertMoveTime(moveTime);
        TestKit.MessageAssert.tilesObject(messages[1]);
        TestKit.MessageAssert.charactersObject(messages[2]);

        done();
    });
}