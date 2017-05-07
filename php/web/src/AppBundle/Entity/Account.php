<?php

declare (strict_types = 1);

namespace AppBundle\Entity;

use Ramsey\Uuid\Uuid;

final class Account
{
    /**
     * @var \Ramsey\Uuid\Uuid
     */
    private $id;

    public function __construct()
    {
        $this->id = Uuid::uuid4();
    }

    /**
     * @return Uuid
     */
    public function id() : Uuid
    {
        return $this->id;
    }
}