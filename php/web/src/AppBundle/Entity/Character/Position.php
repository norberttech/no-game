<?php

declare (strict_types = 1);

namespace AppBundle\Entity\Character;

final class Position
{
    /**
     * @var int
     */
    private $x;

    /**
     * @var int
     */
    private $y;

    /**
     * @param int $x
     * @param int $y
     */
    public function __construct(int $x, int $y)
    {
        $this->x = $x;
        $this->y = $y;
    }

    /**
     * @return int
     */
    public function x() : int
    {
        return $this->x;
    }

    /**
     * @return int
     */
    public function y() : int
    {
        return $this->y;
    }
}