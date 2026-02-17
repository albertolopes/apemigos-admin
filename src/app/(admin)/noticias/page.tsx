'use client';

import React, { useEffect, useState } from 'react';
import {
  getNews,
  deleteNews,
  createNewsWithContent,
  updateNews,
  updateNewsStatus,
} from '@/lib/services/newsService';
import { Noticia, Page, NoticiaStatus } from '@/lib/types';
import NewsTable from '@/components/news/NewsTable';
import NewsForm from '@/components/news/NewsForm';
import NewsContent from '@/components/news/NewsContent';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import ConfirmationDialog from '@/components/ui/modal/ConfirmationDialog';
import api from '@/lib/services/api';
import { useToast } from '@/hooks/useToast';
import Pagination from '@/components/common/Pagination';

export default function NewsPage() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [page, setPage] = useState<Page<Noticia> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false); // Novo estado para loading de status
  const [isDeleting, setIsDeleting] = useState(false); // Novo estado para loading de exclusão
  
  // Estados para seleção
  const [selectedNews, setSelectedNews] = useState<
    (Partial<Noticia> & { longDescription?: string }) | null
  >(null);
  const [newsToDelete, setNewsToDelete] = useState<number | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<{ id: number, status: NoticiaStatus } | null>(null);

  const { addToast } = useToast();

  const fetchNews = async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const response = await getNews(pageNumber);
      setPage(response);
      setNews(response.content);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      addToast({
        variant: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar as notícias.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchFullContent = async (id: number) => {
    try {
      const response = await api.get(`/noticias/conteudo/${id}`);
      return response.data.longDescription;
    } catch (error) {
      console.error('Erro ao buscar conteúdo da notícia:', error);
      addToast({
        variant: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar o conteúdo da notícia.',
      });
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

  // --- Lógica de Exclusão ---
  const handleDeleteClick = (id: number) => {
    setNewsToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (newsToDelete) {
      setIsDeleting(true);
      try {
        await deleteNews(newsToDelete);
        fetchNews(page?.number || 0);
        addToast({
          variant: 'success',
          title: 'Sucesso',
          message: 'Notícia excluída com sucesso!',
        });
      } catch (error) {
        console.error('Erro ao excluir notícia:', error);
        addToast({
          variant: 'error',
          title: 'Erro',
          message: 'Não foi possível excluir a notícia.',
        });
      } finally {
        setIsDeleting(false);
        setIsDeleteConfirmOpen(false);
        setNewsToDelete(null);
      }
    }
  };

  // --- Lógica de Status ---
  const handleStatusChangeClick = (id: number, status: NoticiaStatus) => {
    setStatusToUpdate({ id, status });
    setIsStatusConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (statusToUpdate) {
      setIsStatusUpdating(true);
      try {
        await updateNewsStatus(statusToUpdate.id, statusToUpdate.status);
        fetchNews(page?.number || 0);
        addToast({
          variant: 'success',
          title: 'Sucesso',
          message: `Notícia ${statusToUpdate.status === 'APROVADO' ? 'aprovada' : 'tornada pendente'} com sucesso!`,
        });
      } catch (error) {
        console.error('Erro ao atualizar status da notícia:', error);
        addToast({
          variant: 'error',
          title: 'Erro',
          message: 'Não foi possível atualizar o status da notícia.',
        });
      } finally {
        setIsStatusUpdating(false);
        setIsStatusConfirmOpen(false);
        setStatusToUpdate(null);
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
        addToast({
          variant: 'success',
          title: 'Sucesso',
          message: 'Notícia atualizada com sucesso!',
        });
      } else {
        await createNewsWithContent({
          ...newsData,
          longDescription: newsData.longDescription || '',
        });
        addToast({
          variant: 'success',
          title: 'Sucesso',
          message: 'Notícia criada com sucesso!',
        });
      }
      await fetchNews(page?.number || 0);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar notícia:', error);
      addToast({
        variant: 'error',
        title: 'Erro',
        message: 'Não foi possível salvar a notícia.',
      });
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
        onStatusChange={handleStatusChangeClick}
        isLoading={isLoading}
      />

      {/* Paginação Completa */}
      {page && (
        <Pagination
          currentPage={page.number}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          pageSize={page.size || 10}
          onPageChange={fetchNews}
        />
      )}

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

      {/* Diálogo de Confirmação de Exclusão */}
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta notícia? Esta ação não pode ser desfeita."
        confirmText={isDeleting ? "Excluindo..." : "Excluir"}
        variant="danger"
        isLoading={isDeleting} // Passando loading
      />

      {/* Diálogo de Confirmação de Status */}
      <ConfirmationDialog
        isOpen={isStatusConfirmOpen}
        onClose={() => setIsStatusConfirmOpen(false)}
        onConfirm={confirmStatusChange}
        title={statusToUpdate?.status === 'APROVADO' ? "Aprovar Notícia" : "Desaprovar Notícia"}
        message={
          statusToUpdate?.status === 'APROVADO' 
            ? "Tem certeza que deseja aprovar esta notícia? Ela ficará visível publicamente." 
            : "Tem certeza que deseja tornar esta notícia pendente? Ela deixará de ser visível publicamente."
        }
        confirmText={statusToUpdate?.status === 'APROVADO' ? "Aprovar" : "Tornar Pendente"}
        variant={statusToUpdate?.status === 'APROVADO' ? "primary" : "warning"}
        isLoading={isStatusUpdating} // Passando loading
      />
    </div>
  );
}
