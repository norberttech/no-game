<?php

declare (strict_types = 1);

namespace AppBundle\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

final class UniqueValue extends Constraint
{
    const NOT_UNIQUE_ERROR = '3c18de8e-cad5-45b1-807e-5f0a81b18491';

    public $message = 'This value is already used.';
    public $table;
    public $field;
    public $ignoreNull = true;
    public $lowercase = true;

    protected static $errorNames = array(
        self::NOT_UNIQUE_ERROR => 'NOT_UNIQUE_ERROR',
    );

    public function getRequiredOptions()
    {
        return [
            'table',
            'field'
        ];
    }

    public function validatedBy()
    {
        return 'unique_value';
    }
}