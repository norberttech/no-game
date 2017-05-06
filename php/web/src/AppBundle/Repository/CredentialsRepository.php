<?php

declare (strict_types = 1);

namespace AppBundle\Repository;

use AppBundle\Entity\Credentials;
use Doctrine\ORM\EntityRepository;
use Symfony\Bridge\Doctrine\Security\User\UserLoaderInterface;

final class CredentialsRepository extends EntityRepository implements UserLoaderInterface
{
    /**
     * @param string $username
     * @return Credentials
     */
    public function loadUserByUsername($username)
    {
        return $this->createQueryBuilder('u')
            ->where('u.email = :email')
            ->setParameter('email', $username)
            ->getQuery()
            ->getOneOrNullResult();
    }
}