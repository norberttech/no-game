describe("Kernel", () => {
    const expect = require('expect.js');
    const Kernel = require('./../../../src/NoGame/Engine/Kernel');
    const MonsterFactory = require('./../../../src/NoGame/Engine/MonsterFactory');
    const Monster = require('./../../../src/NoGame/Engine/Monster');
    const Spawn = require('./../../../src/NoGame/Engine/Spawn');
    const Tile = require('./../../../src/NoGame/Engine/Map/Area/Tile');
    const Item = require('./../../../src/NoGame/Engine/Map/Area/Item');
    const Player = require('./../../../src/NoGame/Engine/Player');
    const Position = require('./../../../src/NoGame/Engine/Map/Area/Position');
    const TestKit = require('../TestKit/TestKit');

    let clock = null;
    let area = null;
    let characters = null;
    let monsterFactory = null;
    let logger = null;
    let randomizer = null;

    beforeEach (() =>{
        clock = new TestKit.ManualClock(new Date().getTime());
        randomizer = new TestKit.ManualRandomizer(1);
        monsterFactory = new MonsterFactory(clock);
        characters = new TestKit.Characters();
        area = TestKit.AreaFactory.emptyWalkable(50, 50);
        logger = new TestKit.Logger();
    });

    it ("spawns monsters", () => {
        const SPAWN_DURATION = 100;
        let spawnedMonster = null;
        let spawnTimes = 0;

        monsterFactory.addTemplate("monster", 5, 123456, 50, 10, 500, 10);
        area.addSpawn(new Spawn("monster", 2, SPAWN_DURATION, new Position(10, 10), 5));

        let kernel = new Kernel(characters, area, monsterFactory, clock, randomizer, new TestKit.ExperienceCalculator(), logger);

        kernel.spawnMonsters((monster) => {
            spawnTimes++;
            spawnedMonster = monster;
        });

        clock.pushForward(SPAWN_DURATION);

        kernel.spawnMonsters((monster) => {
            spawnTimes++;
            spawnedMonster = monster;
        });

        clock.pushForward(SPAWN_DURATION);

        kernel.spawnMonsters((monster) => {
            // should no spawn new monster, spawn size is 2
            spawnTimes++;
            spawnedMonster = null;
        });

        expect(spawnTimes).to.be(2);
        expect(spawnedMonster.name).to.be('monster');
    });

    it ("makes monster attack visible players", () => {
        const SPAWN_DURATION = 100;
        let attacked = false;
        let attackedOnce = false;

        monsterFactory.addTemplate("monster", 5, 123456, 50, 10, 500, 10);
        area.addSpawn(new Spawn("monster", 1, SPAWN_DURATION, new Position(10, 10), 1));
        let kernel = new Kernel(characters, area, monsterFactory, clock, new TestKit.ManualRandomizer(1), new TestKit.ExperienceCalculator(), logger);

        kernel.spawnMonsters((monster) => {
            let player = new Player("11111", "player", 100, 100, new Position(12, 12), new Position(12, 12));
            kernel.login(player);

            kernel.chooseMonstersAttackTarget((monster, player) => {
                attacked = true;
                attackedOnce = true;
            });

            kernel.chooseMonstersAttackTarget((monster, player) => {
                attackedOnce = false;
            });
        });

        expect(attackedOnce).to.be(true);
        expect(attacked).to.be(true);
    });

    it ("monsters ignores players that are out of visible range", () => {
        let attacked = false;
        const SPAWN_DURATION = 100;
        monsterFactory.addTemplate("monster", 5, 123456, 50, 10, 500, 10);
        area.addSpawn(new Spawn("monster", 2, SPAWN_DURATION, new Position(10, 10), 1));
        let kernel = new Kernel(characters, area, monsterFactory, clock, new TestKit.ManualRandomizer(1), new TestKit.ExperienceCalculator(), logger);

        kernel.spawnMonsters((monster) => {
            let player = new Player("11111", "player", 100, 100, new Position(monster.position.x + 9, 10), new Position(10, 10));
            kernel.login(player);

            kernel.chooseMonstersAttackTarget((monster, player) => {
                attacked = true;
            });
        });

        expect(attacked).to.be(false);
    });

    it ("makes monster moves to attacked player", () => {
        const SPAWN_DURATION = 100;
        let monsterMoves = 0;

        monsterFactory.addTemplate("monster", 5, 123456, 50, 10, 500, 10);
        area.addSpawn(new Spawn("monster", 2, SPAWN_DURATION, new Position(10, 10), 1));
        let kernel = new Kernel(characters, area, monsterFactory, clock, new TestKit.ManualRandomizer(1), new TestKit.ExperienceCalculator(), logger);

        kernel.spawnMonsters((monster) => {
            let player = new Player("11111", "player", 100, 100, new Position(monster.position.x + 3, monster.position.y), new Position(10, 10));
            kernel.login(player);
            kernel.chooseMonstersAttackTarget((monster, player) => {});
        });

        kernel.moveMonsters((monster) => { monsterMoves++; }, () => {});

        clock.pushForward(600);

        kernel.moveMonsters((monster) => { monsterMoves++; }, () => {});

        expect(monsterMoves).to.be(2);
    });

    it ("handles combat between player and monster", () => {
        const SPAWN_DURATION = 100;
        const MONSTER_DEFENCE = 5;
        const MONSTER_HEALTH = 16;
        let playerExperience = 0;
        let firstDamage = 0;
        let kill = false;

        monsterFactory.addTemplate("monster", 5, 123456, MONSTER_HEALTH, 1, 500, MONSTER_DEFENCE);
        area.addSpawn(new Spawn("monster", 2, SPAWN_DURATION, new Position(10, 10), 1));
        let kernel = new Kernel(characters, area, monsterFactory, clock, new TestKit.ManualRandomizer(1), new TestKit.ExperienceCalculator(), logger);

        kernel.spawnMonsters((monster) => {
            let player = new Player("11111", "player", 100, 100, new Position(monster.position.x + 1, monster.position.y), new Position(10, 10));
            kernel.login(player);
            kernel.chooseMonstersAttackTarget((monster, player) => {});

            kernel.playerAttack(player.id, monster.id);

            kernel.runPlayersAttack(
                (monster, damage) => { firstDamage = damage; }, () => {}, () => {}
            );

            clock.pushForward(3000);

            kernel.runPlayersAttack(
                () => {}, () => {}, (monster) => { kill = true; }
            );

            playerExperience = monster.experience;
        });

        expect(firstDamage).to.be(15); // Player.BASE_ATTACK_POWER - MONSTER_DEFENCE
        expect(kill).to.be(true);
        expect(playerExperience).to.be(5);
    });
});