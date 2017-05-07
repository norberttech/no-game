<?php

declare (strict_types = 1);

namespace AppBundle\Query\ViewModel;

final class Character
{
    /**
     * @var string
     */
    private $name;

    /**
     * @var int
     */
    private $experience;

    /**
     * @param string $name
     */
    public function __construct(string $name, int $experience)
    {
        $this->name = $name;
        $this->experience = $experience;
    }

    /**
     * @return string
     */
    public function name() : string
    {
        return $this->name;
    }

    /**
     * @return int
     */
    public function experience() : int
    {
        return $this->experience;
    }
}