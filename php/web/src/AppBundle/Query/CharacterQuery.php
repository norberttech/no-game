<?php

declare (strict_types = 1);

namespace AppBundle\Query;

use AppBundle\Query\ViewModel\Character;
use Doctrine\DBAL\Connection;

final class CharacterQuery
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * @param Connection $connection
     */
    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    /**
     * @param string $accountId
     * @return Character[]
     */
    public function findAll(string $accountId) : array
    {
        $statement = 'SELECT c.* FROM nogame_character c WHERE c.account_id = :accountId ORDER BY c.experience DESC';

        return array_map(function(array $characterData) {
            return new Character($characterData['name'], $characterData['experience']);
        }, $this->connection->fetchAll($statement, ['accountId' => $accountId]));
    }

    /**
     * @param int $count
     * @return array
     */
    public function top(int $count) : array
    {
        $statement = 'SELECT c.* FROM nogame_character c ORDER BY c.experience DESC LIMIT :charactersCount OFFSET 0';

        return array_map(function(array $characterData) {
            return new Character($characterData['name'], $characterData['experience']);
        }, $this->connection->fetchAll($statement, ['charactersCount' => $count]));
    }
}