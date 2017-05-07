<?php

declare (strict_types = 1);

namespace AppBundle\Validator\Constraints;

use Doctrine\DBAL\Connection;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

final class UniqueValueValidator extends ConstraintValidator
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

    public function validate($value, Constraint $constraint)
    {
        if (is_null($value) && $constraint->ignoreNull) {
            return ;
        }

        $qb = $this->connection->createQueryBuilder();

        $query = $qb->select('COUNT(' . $constraint->field . ')')
            ->from($constraint->table)
            ->where($qb->expr()->eq($constraint->field, ':value'));

        $entryExists = (bool) $this->connection->fetchColumn(
            $query->getSQL(),
            ['value' => ($constraint->lowercase) ? mb_strtolower($value) : $value]
        );

        if ($entryExists) {
            $this->context->buildViolation($constraint->message)
                ->setInvalidValue($value)
                ->setCode(UniqueValue::NOT_UNIQUE_ERROR)
                ->addViolation();
        }
    }
}