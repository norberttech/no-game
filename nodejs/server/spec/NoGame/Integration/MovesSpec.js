describe("Server - Moves -", () => {
    const TestKit = require('./TestKit/TestKit');
    const Kernel = require('./../../../src/NoGame/Engine/Kernel');
    const Account = require('./../../../src/NoGame/Engine/Account');
    const AccountCharacter = require('./../../../src/NoGame/Engine/Account/AccountCharacter');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Protocol = require('./../../../src/NoGame/Server/Protocol');
    const IncomeQueue = require('./../../../src/NoGame/Server/MessageQueue/IncomeQueue');
    const Broadcaster = require('./../../../src/NoGame/Server/Broadcaster');
    const Server = require('./../../../src/NoGame/Server/Server');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
    const MemoryLogger = require('./../../../src/NoGame/Infrastructure/Logger/MemoryLogger');
    const GameLoop = require('./../../../src/NoGame/Server/GameLoop');
    const Clock = require('./../../../src/NoGame/Engine/Clock');

    const PORT = 3333;
    const HOST = `ws://127.0.0.1:${PORT}`;
    const CHAR_01_ID = '01-1111111111';
    const CHAR_02_ID = '02-2222222222';

    let server;
    let area;
    let player;

    beforeEach((done) => {
        area = TestKit.AreaFactory.emptyWalkable(2, 2);
        let logger = new MemoryLogger();
        let clock = new Clock();
        let incomeQueue = new IncomeQueue();
        let broadcaster = new Broadcaster();
        let accounts = new TestKit.Accounts();
        let characters = new TestKit.Characters();
        let kernel = new Kernel(characters, area, new MonsterFactory(new Clock()), new Clock(), logger);
        kernel.boot();

        accounts.addAccount('user-01@nogame.com', 'password', new Account('1111111111', [
                new AccountCharacter(CHAR_01_ID, 'Character 01')
            ])
        );
        accounts.addAccount('user-02@nogame.com', 'password', new Account('2222222222', [
                new AccountCharacter(CHAR_02_ID, 'Character 01')
            ])
        );
        characters.addCharacter(CHAR_01_ID, new Player(CHAR_01_ID, 'Character 01', 0, 100, 100, clock, new Position(1, 1), new Position(0, 0)));
        characters.addCharacter(CHAR_02_ID, new Player(CHAR_02_ID, 'Character 02', 0, 100, 100, clock, new Position(2, 1), new Position(0, 0)));

        let protocol = new Protocol(kernel, accounts, characters, incomeQueue, broadcaster, new TestKit.Logger());

        server = new Server(kernel, protocol, logger, new GameLoop(), broadcaster, incomeQueue);
        server.listen(PORT, () => {
            player = new TestKit.Player();
            player.connect(HOST, () => {
                player.send(TestKit.MessageFactory.login('user-01@nogame.com', 'password'));

                player.expectMsg((message) => {
                    TestKit.MessageAssert.characterListString(message);
                    player.send(TestKit.MessageFactory.loginCharacter(CHAR_01_ID));

                    player.expectMsg((message) => {
                        TestKit.MessageAssert.batchString(message);
                        done(); // player logged in, testsuite can proceed
                    });
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
        });
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
        });
    });

    it("makes sure that player can't walk on another player position", (done) => {
        let opponent = new TestKit.Player();

        opponent.connect(HOST, () => {
            opponent.send(TestKit.MessageFactory.login('user-02@nogame.com', 'password'));

            opponent.expectMsg((message) => {
                TestKit.MessageAssert.characterListString(message);
                opponent.send(TestKit.MessageFactory.loginCharacter(CHAR_02_ID));

                opponent.expectMsg((message) => {
                    TestKit.MessageAssert.batchString(message);

                    player.expectMsg((message) => {
                        TestKit.MessageAssert.charactersString(message); // opponent logged in
                    });

                    player.send(TestKit.MessageFactory.move(2, 1)); // move to opponent position

                    player.expectMsg((message) => {
                        TestKit.MessageAssert.moveString(message).assertX(1).assertY(1).assertMoveTime(0);
                        done();
                    });
                });
            });
        });
    });

    it("sends opponents moves to player", (done) => {
        let opponent = new TestKit.Player();

        opponent.connect(HOST, () => {
            opponent.send(TestKit.MessageFactory.login('user-02@nogame.com', 'password'));

            opponent.expectMsg((message) => {
                TestKit.MessageAssert.characterListString(message);
                opponent.send(TestKit.MessageFactory.loginCharacter(CHAR_02_ID));

                opponent.expectMsg((message) =>{
                    TestKit.MessageAssert.batchString(message);

                    opponent.send(TestKit.MessageFactory.move(2, 1));

                    player.expectMsg((message) => {
                        TestKit.MessageAssert.charactersString(message);
                        done();
                    });
                });
            });
        });
    });

    afterEach((done) => {
        player.disconnect();
        server.terminate(() => done(), 1);
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
});