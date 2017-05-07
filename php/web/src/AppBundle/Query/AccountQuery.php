<?php

declare (strict_types = 1);

namespace AppBundle\Query;

use Doctrine\DBAL\Connection;

final class AccountQuery
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
     * @return int
     */
    public function totalAccounts() : int
    {
        $statement = 'SELECT COUNT(a.id) FROM nogame_account a';

        return $this->connection->fetchColumn($statement);
    }
}