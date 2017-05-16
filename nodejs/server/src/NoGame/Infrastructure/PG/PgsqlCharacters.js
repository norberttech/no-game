'use strict';

const Assert = require('assert-js');
const Characters = require('./../../Engine/Characters');
const Player = require('./../../Engine/Player');
const Position = require('./../../Engine/Map/Area/Position');
const Clock = require('./../../Engine/Clock');
const Pool = require('pg').Pool;

class PgsqlCharacters extends Characters
{
    /**
     * @param {Pool} pool
     * @param {Clock} clock
     */
    constructor(pool, clock)
    {
        super();

        Assert.instanceOf(pool, Pool);
        Assert.instanceOf(clock, Clock);

        this._pool = pool;
        this._clock = clock;
    }

    /**
     * @param {string} characterId
     * @returns {Promise}
     */
    get(characterId)
    {
        Assert.string(characterId);

        return new Promise((resolve, reject) => {
            this._pool.query(
                'SELECT * FROM nogame_character WHERE id = $1',
                [characterId],
                (err, result) => {
                    if (!result.rows.length) {
                        reject(new Error(`Character with id ${characterId} not found.`));
                        return ;
                    }

                    resolve(new Player(
                        result.rows[0].id,
                        result.rows[0].name,
                        result.rows[0].current_health,
                        result.rows[0].health, // replace with max_health,
                        this._clock,
                        new Position(
                            result.rows[0].pos_x,
                            result.rows[0].pos_y
                        ),
                        new Position(
                            result.rows[0].spawn_pos_x,
                            result.rows[0].spawn_pos_y
                        )
                    ));
                }
            )
        });
    }

    /**
     * @param {Player} character
     */
    save(character)
    {
        Assert.instanceOf(character, Player);

        this._pool.query(
            `UPDATE nogame_character
             SET 
                current_health = $2, 
                health = $3,
                pos_x = $4 ,
                pos_y = $5,
                spawn_pos_x = $6,
                spawn_pos_y = $7
            WHERE id = $1`,
            [
                character.id,
                character.health,
                character.maxHealth,
                character.position.x,
                character.position.y,
                character.spawnPosition.x,
                character.spawnPosition.y
            ]
        );
    }
}

module.exports = PgsqlCharacters;