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
import NewsContent from '@/components/news/NewsContent'; // Importando o componente de visualização
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import api from '@/lib/services/api'; // Importando api para buscar conteúdo

export default function NewsPage() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [page, setPage] = useState<Page<Noticia> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Estado para o modal de preview
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

  // Função auxiliar para buscar o conteúdo completo
  const fetchFullContent = async (id: number) => {
    try {
      const response = await api.get(`/noticias/conteudo/${id}`);
      return response.data.longDescription;
    } catch (error) {
      console.error('Erro ao buscar conteúdo da notícia:', error);
      return '';
    }
  };

  const handleAddClick = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (item: Noticia) => {
    const longDescription = await fetchFullContent(item.id);
    setSelectedNews({ ...item, longDescription });
    setIsModalOpen(true);
  };

  const handlePreviewClick = async (item: Noticia) => {
    const longDescription = await fetchFullContent(item.id);
    setSelectedNews({ ...item, longDescription });
    setIsPreviewOpen(true);
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
        onPreview={handlePreviewClick}
      />

      {/* Modal de Formulário */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl">
        <NewsForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedNews}
          isSaving={isSaving}
        />
      </Modal>

      {/* Modal de Pré-visualização */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} className="max-w-4xl">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {selectedNews?.title}
            </h2>
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          
          {selectedNews?.image && (
            <div className="mb-6 w-full h-64 relative rounded-lg overflow-hidden">
              <img 
                src={selectedNews.image} 
                alt={selectedNews.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto pr-2">
            <NewsContent html={selectedNews?.longDescription || ''} />
          </div>
          
          <div className="mt-6 flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
