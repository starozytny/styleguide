<?php

namespace App\Controller\App\Styleguide;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/styleguide/composants', name: 'app_styleguide_components_')]
class ComposantsController extends AbstractController
{
    #[Route('/', name: 'index')]
    public function index(): Response
    {
        return $this->render('app/pages/styleguide/components/index.html.twig');
    }

    #[Route('/boutons', name: 'buttons')]
    public function buttons(): Response
    {
        return $this->render('app/pages/styleguide/components/buttons.html.twig');
    }
}
