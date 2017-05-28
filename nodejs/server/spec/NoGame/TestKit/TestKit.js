'use strict';

const MessageFactory = require('./MessageFactory');
const MessageAssert = require('./MessageAssert');
const MessageParser = require('./MessageParser');
const ManualGameLoop = require('./ManualGameLoop');
const ManualClock = require('./ManualClock');
const ManualRandomizer = require('./ManualRandomizer');
const AreaFactory = require('./AreaFactory');
const Player = require('./Player');
const MemoryLogger = require('./../../../src/NoGame/Infrastructure/Logger/MemoryLogger');
const InMemoryAccounts = require('./../../../src/NoGame/Infrastructure/InMemory/InMemoryAccounts');
const InMemoryCharacters = require('./../../../src/NoGame/Infrastructure/InMemory/InMemoryCharacters');
const ExperienceCalculator = require('nogame-common').ExperienceCalculator;

module.exports = {
    MessageFactory: MessageFactory,
    MessageAssert: MessageAssert,
    MessageParser: MessageParser,
    AreaFactory: AreaFactory,
    ManualGameLoop: ManualGameLoop,
    ManualClock: ManualClock,
    Player: Player,
    Logger: MemoryLogger,
    Accounts: InMemoryAccounts,
    Characters: InMemoryCharacters,
    ManualRandomizer: ManualRandomizer,
    ExperienceCalculator: ExperienceCalculator
};