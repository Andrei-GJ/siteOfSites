<?php

namespace App\Controller;

use App\Service\SiteService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class SitesController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('sites/index.html.twig');
    }

    #[Route('/api/sites', name: 'api_get_sites', methods: ['GET'])]
    public function getSites(SiteService $siteService): Response
    {
        return $this->json($siteService->getSites());
    }

    #[Route('/api/sites', name: 'api_create_site', methods: ['POST'])]
    public function createSite(Request $request, SiteService $siteService): Response
    {
        $data = json_decode($request->getContent(), true);

        $siteService->createSite($data['name'], $data['url'], (int) $data['category_id']);

        return $this->json(['success' => true]);
    }

    #[Route('/api/sites/{id}', name: 'api_delete_site', methods: ['DELETE'])]
    public function deleteSite(int $id, SiteService $siteService): Response
    {
        $siteService->deleteSite($id);

        return $this->json(['success' => true]);
    }

    #[Route('/api/categories', name: 'api_get_categories', methods: ['GET'])]
    public function getCategories(SiteService $siteService): Response
    {
        return $this->json($siteService->getCategories());
    }

    #[Route('/api/categories', name: 'api_create_category', methods: ['POST'])]
    public function createCategory(Request $request, SiteService $siteService): Response
    {
        $data = json_decode($request->getContent(), true);

        $siteService->createCategory($data['name']);

        return $this->json(['success' => true]);
    }

    #[Route('/api/categories/{id}', name: 'api_delete_category', methods: ['DELETE'])]
    public function deleteCategory(int $id, SiteService $siteService): Response
    {
        try {
            $siteService->deleteCategory($id);
            return $this->json(['success' => true]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => 'La categoría está en uso por uno o más sitios.'
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
