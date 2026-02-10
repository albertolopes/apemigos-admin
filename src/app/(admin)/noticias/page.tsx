'use client';

import React, { useEffect, useState } from 'react';
import {
  getNews,
  getNewsContent,
  deleteNews,
  createNewsWithContent,
  updateNewsWithContent,
} from '@/lib/services/newsService';
import { Noticia, Page } from '@/lib/types';
import NewsTable from '@/components/news/NewsTable';
import NewsForm from '@/components/news/NewsForm';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import ConfirmDialog from '@/components/ui/modal/ConfirmDialog';
import Alert from '@/components/ui/alert/Alert';

import Input from '@/components/form/input/InputField';
import { useToast } from '@/hooks/useToast';

export default function NewsPage() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [page, setPage] = useState<Page<Noticia> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNews, setSelectedNews] = useState<
    (Partial<Noticia> & { longDescription?: string }) | null
  >(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [newsToDeleteId, setNewsToDeleteId] = useState<number | null>(null);
  const { addToast } = useToast();

  const fetchNews = async (pageNumber = 0) => {
    try {
      // Pass searchTerm to getNews
      const response = await getNews(pageNumber, 10, searchTerm);
      setPage(response);
      setNews(response.content);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []); // Initial load

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(0); // Reset to page 0 on new search
  };

  const handleAddClick = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };
  // ... (rest of imports/logic)


  const handleEditClick = async (item: Noticia) => {
    try {
      const content = await getNewsContent(item.id);

      setSelectedNews({
        ...item,
        longDescription: content.longDescription || '',
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar conteúdo da notícia:', error);
      addToast({
        variant: 'error',
        title: 'Erro de Carregamento',
        message: 'Não foi possível carregar o conteúdo completo da notícia.'
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setNewsToDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (newsToDeleteId === null) return;

    try {
      await deleteNews(newsToDeleteId);
      addToast({
        variant: 'success',
        title: 'Excluído',
        message: 'Notícia excluída com sucesso.'
      });
      fetchNews();
    } catch (error) {
      console.error('Erro ao excluir notícia:', error);
      addToast({
        variant: 'error',
        title: 'Erro de Exclusão',
        message: 'Não foi possível excluir a notícia.'
      });
    } finally {
      setIsConfirmOpen(false);
      setNewsToDeleteId(null);
    }
  };

  const handleSave = async (
    newsData: Partial<Noticia> & { longDescription?: string }
  ) => {
    setIsSaving(true);
    try {
      if (newsData.id) {
        await updateNewsWithContent(newsData.id, {
          ...newsData,
          longDescription: newsData.longDescription || '',
        });
      } else {
        await createNewsWithContent({
          ...newsData,
          longDescription: newsData.longDescription || '',
        });
      }
      await fetchNews();
      setIsModalOpen(false);
      addToast({
        variant: 'success',
        title: 'Sucesso!',
        message: newsData.id ? 'Notícia atualizada com sucesso.' : 'Notícia criada com sucesso.'
      });
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      addToast({
        variant: 'error',
        title: 'Erro ao Salvar',
        message: 'Ocorreu um erro ao tentar salvar a notícia.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Gerenciamento de Notícias
        </h1>

        <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
          <form onSubmit={handleSearch} className="flex items-end gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-64">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Buscar por palavra chave
              </label>
              <Input
                id="search"
                type="text"
                placeholder="Ex: Esclerose"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <Button variant="primary" onClick={handleAddClick} className="mb-[1px]">
            Adicionar Notícia
          </Button>
        </div>
      </div>

      <NewsTable
        news={news}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Pagination Controls */}
      {page && (
        <div className="flex items-center justify-between mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total de itens: <span className="font-medium text-gray-900 dark:text-white">{page.totalElements}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
              Página {page.number + 1} de {page.totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNews(page.number - 1)}
              disabled={page.number === 0}
            >
              Anterior
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNews(page.number + 1)}
              disabled={page.number >= page.totalPages - 1}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl">
        <NewsForm
          onSave={handleSave}
          onCancel={() => setIsModalOpen(false)}
          initialData={selectedNews}
          isSaving={isSaving}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita."
        confirmText="Excluir"
      />
    </div>
  );
}
