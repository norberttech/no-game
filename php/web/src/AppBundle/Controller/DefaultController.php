<?php

namespace AppBundle\Controller;

use AppBundle\Query\AccountQuery;
use AppBundle\Query\CharacterQuery;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="nogame_home")
     */
    public function indexAction(Request $request)
    {
        $accountQuery = new AccountQuery($this->get('database_connection'));
        $characterQuery = new CharacterQuery($this->get('database_connection'));

        $total = $accountQuery->totalAccounts();
        $top10 = $characterQuery->top(10);

        return $this->render('default/index.html.twig', [
            'totalAccounts' => $total,
            'top10' => $top10
        ]);
    }
}
