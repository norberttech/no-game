'use strict';

const ServerMessages = {
    BATCH_MESSAGE: 'batch',
    LOGIN: 'login',
    LOGOUT: 'logout',
    AREA: 'area',
    TILE: 'tile',
    TILES: 'tiles',
    MOVE: 'move',
    HEALTH: 'health',
    CHARACTERS: 'characters',
    CHARACTER_LOGOUT: 'character_logout',
    CHARACTER_MOVE: 'character_move',
    CHARACTER_SAY: 'character_say',
    CHARACTER_HEALTH: 'character_health',
    CHARACTER_DIED: 'character_died',
    CHARACTER_PARRY: 'character_parry',
    MONSTER_MOVE: 'monster_move',
    MONSTER_ATTACK: 'monster_attack'
};

module.exports = ServerMessages;