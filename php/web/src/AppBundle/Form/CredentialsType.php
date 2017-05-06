<?php

declare (strict_types = 1);

namespace AppBundle\Form;

use AppBundle\Validator\Constraints\UniqueValue;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

final class CredentialsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'constraints' => [
                    new NotBlank(),
                    new Email([
                        'checkMX' => true,
                        'checkHost' => true
                    ]),
                    new UniqueValue([
                        'field' => 'email',
                        'table' => 'nogame_credentials',
                        'message' => 'This email is already used.'
                    ])
                ]
            ])
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'options' => [
                    'constraints' => [
                        new NotBlank(),
                        new Length(['min' => 5])
                    ]
                ],
                'first_options'  => [
                    'label' => 'Password'
                ],
                'second_options' => [
                    'label' => 'Repeat Password'
                ],
            ]);
    }
}