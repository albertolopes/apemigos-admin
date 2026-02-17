'use client';

import React, { useEffect, useState } from 'react';
import { getAssociados, updateAssociadoStatus } from '@/lib/services/associadoService';
import { AssociadoResponseDTO, Page, StatusCarteirinha } from '@/lib/types';
import AssociadoTable from '@/components/carteirinha/AssociadoTable';
import AssociadoModal from '@/components/carteirinha/AssociadoModal';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

export default function CarteirinhaPage() {
  const [associados, setAssociados] = useState<AssociadoResponseDTO[]>([]);
  const [page, setPage] = useState<Page<AssociadoResponseDTO> | null>(null);
  const [keyword, setKeyword] = useState('');
  const [selectedAssociado, setSelectedAssociado] = useState<AssociadoResponseDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssociados = async (pageNumber = 0) => {
    try {
      const response = await getAssociados(pageNumber, 10, keyword);
      setPage(response);
      setAssociados(response.content);
    } catch (error) {
      console.error('Erro ao buscar associados:', error);
    }
  };

  useEffect(() => {
    fetchAssociados();
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
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Gerenciamento de Carteirinhas
        </h1>
        <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Buscar por nome, CPF..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button type="submit" variant="primary">
            Buscar
          </Button>
        </form>
      </div>

      <AssociadoTable associados={associados} onView={handleView} />

      {/* Paginação simples */}
      {page && (
        <div className="mt-4 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page.first}
            onClick={() => fetchAssociados(page.number - 1)}
          >
            Anterior
          </Button>
          <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            Página {page.number + 1} de {page.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page.last}
            onClick={() => fetchAssociados(page.number + 1)}
          >
            Próxima
          </Button>
        </div>
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
