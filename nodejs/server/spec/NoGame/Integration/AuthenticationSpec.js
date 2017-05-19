describe("Server - Authentication -", () => {
    const TestKit = require('./TestKit/TestKit');
    const Kernel = require('./../../../src/NoGame/Engine/Kernel');
    const Account = require('./../../../src/NoGame/Engine/Account');
    const AccountCharacter = require('./../../../src/NoGame/Engine/Account/AccountCharacter');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const Protocol = require('./../../../src/NoGame/Server/Protocol');
    const IncomeQueue = require('./../../../src/NoGame/Server/MessageQueue/IncomeQueue');
    const Broadcaster = require('./../../../src/NoGame/Server/Broadcaster');
    const Server = require('./../../../src/NoGame/Server/Server');
    const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
    const MemoryLogger = require('./../../../src/NoGame/Infrastructure/Logger/MemoryLogger');
    const GameLoop = require('./../../../src/NoGame/Server/GameLoop');
    const Clock = require('./../../../src/NoGame/Engine/Clock');

    const PORT = 3333;
    const HOST = `ws://127.0.0.1:${PORT}`;
    const CHAR_01_ID = '01-1111111111';
    const CHAR_02_ID = '02-2222222222';

    let server;

    beforeEach((done) => {
        let area = TestKit.AreaFactory.emptyWalkable(10, 10);
        let logger = new MemoryLogger();
        let clock = new Clock();
        let incomeQueue = new IncomeQueue();
        let broadcaster = new Broadcaster();
        let accounts = new TestKit.Accounts();
        let characters = new TestKit.Characters();
        let kernel = new Kernel(characters, area, new MonsterFactory(new Clock()), clock, logger);

        accounts.addAccount('user-01@nogame.com', 'password', new Account('1111111111', [
                new AccountCharacter(CHAR_01_ID, 'Character 01')
            ])
        );
        accounts.addAccount('user-02@nogame.com', 'password', new Account('2222222222', [
                new AccountCharacter(CHAR_02_ID, 'Character 01')
            ])
        );
        characters.addCharacter(CHAR_01_ID, new Player(CHAR_01_ID, 'Character 01', 0, 100, 100, clock, new Position(0, 0), new Position(0, 0)));
        characters.addCharacter(CHAR_02_ID, new Player(CHAR_02_ID, 'Character 02', 0, 100, 100, clock, new Position(0, 0), new Position(0, 0)));

        let protocol = new Protocol(kernel, accounts, characters, incomeQueue, broadcaster, new TestKit.Logger());

        kernel.boot();
        server = new Server(kernel, protocol, logger, new GameLoop(), broadcaster, incomeQueue);
        server.listen(PORT, () => {
            done();
        });
    });

    it("sends login, area, tiles and characters messages after successful login", (done) => {
        let player = new TestKit.Player();
        player.connect(HOST, () => {
            player.send(TestKit.MessageFactory.login('user-01@nogame.com', 'password'));

            player.expectMsg((message) => {
                TestKit.MessageAssert.characterListString(message);
                player.send(TestKit.MessageFactory.loginCharacter(CHAR_01_ID));

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
    });

    it("sends account not found when account does not exists", (done) => {
        let player = new TestKit.Player();
        player.connect(HOST, () => {
            player.send(TestKit.MessageFactory.login('not-found@nogame.com', 'password'));

            player.expectMsg((message) => {
                TestKit.MessageAssert.loginAccountNotFoundString(message);
                done();
            });
        });
    });

    it("sends account not found when account exists but character not exists", (done) => {
        let player = new TestKit.Player();
        player.connect(HOST, () => {
            player.send(TestKit.MessageFactory.login('user-01@nogame.com', 'password'));

            player.expectMsg((message) => {
                TestKit.MessageAssert.characterListString(message);
                player.send(TestKit.MessageFactory.loginCharacter('ID_THAT_NOT_EXISTS'));

                player.expectMsg((message) => {
                    TestKit.MessageAssert.loginAccountNotFoundString(message);
                    done();
                });
            });
        });
    });

    it("sends characters and logout message after other player login or logout in visible area", (done) => {
        let player1 = new TestKit.Player();
        let player2 = new TestKit.Player();

        player1.connect(HOST, () => {
            player1.send(TestKit.MessageFactory.login('user-01@nogame.com', 'password'));

            player1.expectMsg((message) => {
                TestKit.MessageAssert.characterListString(message);
                player1.send(TestKit.MessageFactory.loginCharacter(CHAR_01_ID));

                player1.expectMsg((message) => {
                    TestKit.MessageAssert.batchString(message);

                    player2.connect(HOST, () => {
                        player2.send(TestKit.MessageFactory.login('user-02@nogame.com', 'password'));
                        player2.expectMsg((message) => {
                            TestKit.MessageAssert.characterListString(message);

                            player2.send(TestKit.MessageFactory.loginCharacter(CHAR_02_ID));

                            player1.expectMsg((message) => {
                                TestKit.MessageAssert.charactersString(message);

                                player2.disconnect();
                            });

                            player1.expectMsg((message) => {
                                TestKit.MessageAssert.characterLogoutString(message);

                                player1.disconnect();
                                done();
                            });
                        });
                    });
                });
            });
        });
    });

    afterEach((done) => {
        server.terminate(() => done(), 1);
    });
});
