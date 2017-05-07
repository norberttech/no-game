<?php

declare (strict_types = 1);

namespace AppBundle\Form;

use AppBundle\Validator\Constraints\UniqueValue;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\NotBlank;

final class CharacterType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name', TextType::class, [
                'constraints' => [
                    new NotBlank(),
                    new UniqueValue([
                        'field' => 'normalized_name',
                        'table' => 'nogame_character',
                        'message' => 'This character name is already used.'
                    ])
                ]
            ]);
    }
}