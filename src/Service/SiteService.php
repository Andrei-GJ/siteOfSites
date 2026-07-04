<?php

namespace App\Service;

use Doctrine\DBAL\Connection;

class SiteService
{
    private Connection $connection;

    public function __construct(Connection $connection)
    {
        $this->connection = $connection;
    }

    public function getSites(): array
    {
        return $this->connection->fetchAllAssociative(
            'SELECT s.id, s.name, s.url, c.name as category_name 
             FROM sites s 
             JOIN categories c ON s.category_id = c.id 
             ORDER BY s.id DESC'
        );
    }

    public function createSite(string $name, string $url, int $categoryId): void
    {
        $this->connection->executeStatement(
            'INSERT INTO sites (name, url, category_id) VALUES (:name, :url, :category_id)',
            [
                'name' => $name,
                'url' => $url,
                'category_id' => $categoryId
            ]
        );
    }

    public function deleteSite(int $id): void
    {
        $this->connection->executeStatement('DELETE FROM sites WHERE id = :id', ['id' => $id]);
    }

    public function getCategories(): array
    {
        return $this->connection->fetchAllAssociative('SELECT id, name FROM categories ORDER BY name ASC');
    }

    public function createCategory(string $name): void
    {
        $this->connection->executeStatement('INSERT INTO categories (name) VALUES (:name)', ['name' => $name]);
    }

    public function deleteCategory(int $id): void
    {
        $this->connection->executeStatement('DELETE FROM categories WHERE id = :id', ['id' => $id]);
    }
}
