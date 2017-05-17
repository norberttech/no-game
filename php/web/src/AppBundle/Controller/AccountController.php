<?php

declare (strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Character;
use AppBundle\Form\CharacterType;
use AppBundle\Query\CharacterQuery;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

final class AccountController extends Controller
{
    const SPAWN_POSITION_X = 42;
    const SPAWN_POSITION_Y = 12;

    /**
     * @Route("/account", name="nogame_account")
     */
    public function indexAction()
    {
        $characterQuery = new CharacterQuery($this->get('database_connection'));

        return $this->render('account/index.html.twig', [
            'characters' => $characterQuery->findAll((string) $this->getUser()->accountId())
        ]);
    }

    /**
     * @Route("/account/character", name="nogame_create_character")
     */
    public function createCharacterAction(Request $request)
    {
        $form = $this->createForm(CharacterType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $character = new Character(
                $this->getUser()->accountId(),
                $form->get('name')->getData(),
                100,
                new Character\Position(
                    self::SPAWN_POSITION_X,
                    self::SPAWN_POSITION_Y
                )
            );

            $em = $this->getDoctrine()->getManager();
            $em->persist($character);
            $em->flush();

            $this->addFlash('success', 'Your character was successfully created.');

            return $this->redirectToRoute('nogame_account');
        }

        return $this->render(
            'account/character.html.twig',
            ['form' => $form->createView()]
        );
    }
}