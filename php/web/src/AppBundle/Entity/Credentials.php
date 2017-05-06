<?php

declare (strict_types = 1);

namespace AppBundle\Entity;

use NoGame\Assertion;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Security\Core\User\UserInterface;

final class Credentials implements UserInterface, \Serializable
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
    private $passwordHash;

    /**
     * @var string
     */
    private $salt;

    /**
     * @var string
     */
    private $email;

    /**
     * @param Uuid $accountId
     * @param string $email
     * @param string $salt
     */
    public function __construct(Uuid $accountId, string $email, string $salt)
    {
        Assertion::email($email);
        Assertion::notEmpty($salt);

        $this->id = Uuid::uuid4();
        $this->accountId = $accountId;
        $this->salt = $salt;
        $this->email = mb_strtolower($email);
        $this->accountId = $accountId;
    }

    /**
     * @param string $hash
     */
    public function setPasswordHash(string $hash)
    {
        $this->passwordHash = $hash;
    }

    public function getRoles()
    {
        return ['ROLE_USER'];
    }

    public function getPassword()
    {
        return $this->passwordHash;
    }

    public function getSalt()
    {
        return $this->salt;
    }

    public function getUsername()
    {
        return $this->email;
    }

    public function eraseCredentials()
    {
        // TODO: Implement eraseCredentials() method.
    }

    /**
     * @return Uuid
     */
    public function accountId() : Uuid
    {
        return $this->accountId;
    }

    public function serialize()
    {
        return serialize([
            $this->id,
            $this->email,
            $this->passwordHash,
            $this->accountId,
            // $this->salt,
        ]);
    }

    /** @see \Serializable::unserialize()
     * @param string $serialized
     */
    public function unserialize($serialized)
    {
        list(
            $this->id,
            $this->email,
            $this->passwordHash,
            $this->accountId,
            // $this->salt
            ) = unserialize($serialized);
    }
}