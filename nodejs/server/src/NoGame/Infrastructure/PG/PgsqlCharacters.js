'use strict';

const Assert = require('assert-js');
const Logger = require('./../../Common/Logger');
const ExperienceCalculator = require('./../../Common/ExperienceCalculator');
const Characters = require('./../../Engine/Characters');
const Player = require('./../../Engine/Player');
const Position = require('./../../Engine/Map/Area/Position');
const Pool = require('pg').Pool;

class PgsqlCharacters extends Characters
{
    /**
     * @param {Pool} pool
     * @param {Logger} logger
     */
    constructor(pool, logger, expCalculator)
    {
        super();

        Assert.instanceOf(pool, Pool);
        Assert.instanceOf(logger, Logger);
        Assert.instanceOf(expCalculator, ExperienceCalculator);

        this._pool = pool;
        this._logger = logger;
        this._expCalculator = expCalculator;
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
                'SELECT * FROM nogame_character WHERE id = $1 ORDER BY id',
                [characterId],
                (err, result) => {
                    if (!result.rows.length) {
                        reject(new Error(`Character with id ${characterId} not found.`));
                        return ;
                    }

                    let player = new Player(
                        result.rows[0].id,
                        result.rows[0].name,
                        result.rows[0].current_health,
                        result.rows[0].health, // replace with max_health,
                        new Position(
                            result.rows[0].pos_x,
                            result.rows[0].pos_y
                        ),
                        new Position(
                            result.rows[0].spawn_pos_x,
                            result.rows[0].spawn_pos_y
                        )
                    );
                    player.earnExperience(result.rows[0].experience, this._expCalculator);
                    resolve(player);
                }
            )
        });
    }

    /**
     * @param {Player} character
     */
    async save(character)
    {
        Assert.instanceOf(character, Player);

        try {
            this._logger.debug(`Saving character ${character.id}.`);
            var res = await this._pool.query(
                `UPDATE nogame_character
             SET 
                experience = $2,
                current_health = $3, 
                health = $4,
                pos_x = $5,
                pos_y = $6,
                spawn_pos_x = $7,
                spawn_pos_y = $8
            WHERE id = $1`,
                [
                    character.id,
                    character.experience,
                    character.health,
                    character.maxHealth,
                    character.position.x,
                    character.position.y,
                    character.spawnPosition.x,
                    character.spawnPosition.y
                ]
            )
            this._logger.debug(`Character ${character.id} saved.`);
        } catch (err) {
            this._logger.error(`Can't save character ${character.id} saved.`);
            this._logger.error(err);
        }
    }
}

module.exports = PgsqlCharacters;