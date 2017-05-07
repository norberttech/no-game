<?php

declare(strict_types = 1);

namespace NoGame;

use Assert\Assertion as BaseAssertion;

final class Assertion extends BaseAssertion
{
    protected static $exceptionClass = 'NoGame\Exception\AssertionFailedException';
}
