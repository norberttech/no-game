<?php

declare (strict_types = 1);

namespace AppBundle\Entity;

use AppBundle\Entity\Character\Position;
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
     * @var int
     */
    private $spawnPosX;

    /**
     * @var int
     */
    private $spawnPosY;

    /**
     * @var int
     */
    private $posX;

    /**
     * @var int
     */
    private $posY;

    /**
     * @param Uuid $accountId
     * @param string $name
     * @param int $health
     * @param Position $spawnPosition
     */
    public function __construct(Uuid $accountId, string $name, int $health, Position $spawnPosition)
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
        $this->spawnPosX = $spawnPosition->x();
        $this->spawnPosY = $spawnPosition->y();
        $this->posX = $spawnPosition->x();
        $this->posY = $spawnPosition->y();
    }
}