<?php

declare (strict_types = 1);

namespace AppBundle\Controller;

use AppBundle\Entity\Account;
use AppBundle\Entity\Credentials;
use AppBundle\Form\CredentialsType;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

final class RegistrationController extends Controller
{
    /**
     * @Route("/register", name="nogame_registration")
     */
    public function registerAction(Request $request)
    {
        $form = $this->createForm(CredentialsType::class);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $salt = base64_encode(random_bytes(10));
            $account = new Account();
            $credentials = new Credentials(
                $account->id(),
                $form->get('email')->getData(),
                $salt
            );

            $password = $this->get('security.password_encoder')
                ->encodePassword($credentials, $form->get('plainPassword')->getData());

            $credentials->setPasswordHash($password);

            $em = $this->getDoctrine()->getManager();
            $em->persist($account);
            $em->persist($credentials);
            $em->flush();

            $this->addFlash('success', 'Your account was successfully created.');

            return $this->redirectToRoute('nogame_login');
        }

        return $this->render(
            'registration/register.html.twig',
            array('form' => $form->createView())
        );
    }
}