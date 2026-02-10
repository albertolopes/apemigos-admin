'use client';

import React, { useEffect, useState } from 'react';
import {
  getNews,
  deleteNews,
  createNewsWithContent,
  updateNews,
} from '@/lib/services/newsService';
import { Noticia, Page } from '@/lib/types';
import NewsTable from '@/components/news/NewsTable';
import NewsForm from '@/components/news/NewsForm';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal'; // Ajuste a importação conforme a exportação do componente Modal

export default function NewsPage() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [page, setPage] = useState<Page<Noticia> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedNews, setSelectedNews] = useState<
    (Partial<Noticia> & { longDescription?: string }) | null
  >(null);

  const fetchNews = async (pageNumber = 0) => {
    try {
      const response = await getNews(pageNumber);
      setPage(response);
      setNews(response.content);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleAddClick = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (item: Noticia) => {
    // TODO: Buscar o conteúdo completo (longDescription) antes de abrir
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta notícia?')) {
      try {
        await deleteNews(id);
        fetchNews();
      } catch (error) {
        console.error('Erro ao excluir notícia:', error);
      }
    }
  };

  const handleSave = async (
    newsData: Partial<Noticia> & { longDescription?: string }
  ) => {
    setIsSaving(true);
    try {
      if (newsData.id) {
        await updateNews(newsData.id, newsData);
      } else {
        await createNewsWithContent({
          ...newsData,
          longDescription: newsData.longDescription || '',
        });
      }
      await fetchNews();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      alert('Erro ao salvar notícia. Verifique o console.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Gerenciamento de Notícias
        </h1>
        <Button variant="primary" onClick={handleAddClick}>
          Adicionar Notícia
        </Button>
      </div>

      <NewsTable
        news={news}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Paginação pode ser adicionada aqui usando page.totalPages */}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl">
        <NewsForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedNews}
          isSaving={isSaving}
        />
      </Modal>
    </div>
  );
}
