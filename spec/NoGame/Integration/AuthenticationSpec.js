'use strict';

const Kernel = require('./../../../src/NoGame/Engine/Kernel');
const Server = require('./../../../src/NoGame/Server/Server');
const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
const MemoryLogger = require('./../../../src/NoGame/Infrastructure/Logger/MemoryLogger');
const TestKit = require('./TestKit/TestKit');

const PORT = 3333;
const HOST = `ws://127.0.0.1:${PORT}`;

describe("Server - Authentication -", () => {
    let server;

    beforeEach((done) => {
        let area = TestKit.AreaFactory.emptyWalkable(10, 10);
        let logger = new MemoryLogger();
        let kernel = new Kernel(logger, area, new MonsterFactory());
        kernel.boot();

        server = new Server(kernel, logger);
        server.listen(PORT, () => {
            done();
        });
    });

    it("sends login, area, tiles and characters messages after successful login", (done) => {
        let player = new TestKit.Player();
        player.connect(HOST, () => {
            player.send(TestKit.MessageFactory.authenticate('test'));

            player.expectMsg((message) => {
                TestKit.MessageAssert.batchString(message);

                let messages = TestKit.MessageParser.parseBatch(message);

                TestKit.MessageAssert.loginObject(messages[0]);
                TestKit.MessageAssert.areaObject(messages[1]);
                TestKit.MessageAssert.tilesObject(messages[2]);
                TestKit.MessageAssert.charactersObject(messages[3]);

                player.disconnect();
                done();
            });
        });
    });

    it("sends characters and logout message after other player login or logout in visible area", (done) => {
        let player1 = new TestKit.Player();
        let player2 = new TestKit.Player();

        player1.connect(HOST, () => {
            player1.send(TestKit.MessageFactory.authenticate('player1'));

            player1.expectMsg((message) => {
                TestKit.MessageAssert.batchString(message);

                player2.connect(HOST, () => {
                    player2.send(TestKit.MessageFactory.authenticate('player2'));
                    player2.expectMsg((message) => {
                        TestKit.MessageAssert.batchString(message);
                    });
                });
            });

            player1.expectMsg((message) => {
                TestKit.MessageAssert.charactersString(message);

                player2.disconnect();
            });

            player1.expectMsg((message) => {
                TestKit.MessageAssert.characterLogoutString(message);

                player1.disconnect();
                done();
            })
        });
    });

    afterEach((done) => {
        server.terminate(() => done());
    });
});
