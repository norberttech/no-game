<?php

declare (strict_types = 1);

namespace AppBundle\Entity;

use NoGame\Assertion;
use Ramsey\Uuid\Uuid;

final class Character
{
    /**
     * @var Uuid
     */
    private $id;

    /**
     * @var Uuid
     */
    private $accountId;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $normalizedName;

    /**
     * @var int
     */
    private $health;

    /**
     * @var int
     */
    private $currentHealth;

    /**
     * @var int
     */
    private $experience;

    /**
     * @param Uuid $accountId
     * @param string $name
     * @param int $health
     */
    public function __construct(Uuid $accountId, string $name, int $health)
    {
        $this->id = Uuid::uuid4();
        Assertion::notEmpty($name);
        Assertion::lessThan(mb_strlen($name), 255);
        Assertion::integer($health);
        Assertion::greaterThan($health, 0);

        $this->accountId = $accountId;
        $this->name = $name;
        $this->normalizedName = mb_strtolower($name);
        $this->health = $health;
        $this->currentHealth = $health;
        $this->experience = 0;
    }
}