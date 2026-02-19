'use client';

import React, { useEffect, useState } from 'react';
import { getAssociados, updateAssociadoStatus } from '@/lib/services/associadoService';
import { AssociadoResponseDTO, Page, StatusCarteirinha } from '@/lib/types';
import AssociadoTable from '@/components/carteirinha/AssociadoTable';
import AssociadoModal from '@/components/carteirinha/AssociadoModal';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';
import { useToast } from '@/hooks/useToast';
import Pagination from '@/components/common/Pagination';

const statusOptions: { value: StatusCarteirinha | ''; label: string }[] = [
  { value: '', label: 'Todos os Status' },
  { value: 'SOLICITADA', label: 'Solicitada' },
  { value: 'EM_ANALISE', label: 'Em Análise' },
  { value: 'PENDENTE_DOC', label: 'Pendente Documentação' },
  { value: 'APROVADA', label: 'Aprovada' },
  { value: 'EM_PRODUCAO', label: 'Em Produção' },
  { value: 'EXPEDIDA', label: 'Expedida' },
  { value: 'ENVIADA', label: 'Enviada' },
  { value: 'ENTREGUE', label: 'Entregue' },
  { value: 'CANCELADA', label: 'Cancelada' },
  { value: 'VENCIDA', label: 'Vencida' },
];

export default function CarteirinhaPage() {
  const [associados, setAssociados] = useState<AssociadoResponseDTO[]>([]);
  const [page, setPage] = useState<Page<AssociadoResponseDTO> | null>(null);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusCarteirinha | ''>(''); // Estado do filtro
  const [selectedAssociado, setSelectedAssociado] = useState<AssociadoResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { addToast } = useToast();

  const fetchAssociados = async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const response = await getAssociados(pageNumber, 10, keyword, statusFilter);
      setPage(response);
      setAssociados(response.content);
    } catch (error) {
      console.error('Erro ao buscar associados:', error);
      addToast({
        variant: 'error',
        title: 'Erro',
        message: 'Não foi possível carregar os associados.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Recarrega quando o filtro de status muda
  useEffect(() => {
    fetchAssociados(0);
  }, [statusFilter]);

  // Carrega inicial
  useEffect(() => {
    fetchAssociados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssociados(0);
  };

  const handleView = (associado: AssociadoResponseDTO) => {
    setSelectedAssociado(associado);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: number, status: StatusCarteirinha) => {
    try {
      await updateAssociadoStatus(id, status);
      fetchAssociados(page?.number || 0);
      setIsModalOpen(false);
      addToast({
        variant: 'success',
        title: 'Sucesso',
        message: 'Status atualizado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      addToast({
        variant: 'error',
        title: 'Erro',
        message: 'Não foi possível atualizar o status.',
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Gerenciamento de Carteirinhas
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          {/* Filtro de Status */}
          <select
            className="h-11 px-4 py-2.5 rounded-lg border border-gray-300 bg-transparent text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 sm:w-48"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusCarteirinha | '')}
          >
            {statusOptions.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Busca por Palavra-chave */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Buscar por nome, CPF..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? '...' : 'Buscar'}
            </Button>
          </form>
        </div>
      </div>

      <AssociadoTable associados={associados} onView={handleView} isLoading={isLoading} />

      {/* Paginação Completa */}
      {page && (
        <Pagination
          currentPage={page.number}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          pageSize={page.size || 10}
          onPageChange={fetchAssociados}
        />
      )}

      <AssociadoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        associado={selectedAssociado}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
