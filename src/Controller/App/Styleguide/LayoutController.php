<?php

namespace App\Controller\App\Styleguide;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/styleguide/layouts', name: 'app_styleguide_layouts_')]
class LayoutController extends AbstractController
{
    #[Route('/layout/{num}/{position}/{type}', name: 'layout')]
    public function layout($num, $position, $type): Response
    {
        return $this->render('app/pages/styleguide/layouts/index.html.twig', [
            'layout_num' => $num,
            'layout_position' => $position,
            'layout_type' => $type,
        ]);
    }
}
