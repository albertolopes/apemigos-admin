import React from 'react';
import Button from '../ui/button/Button';
import { ChevronLeftIcon, ArrowRightIcon } from '@/icons'; // Usando ícones existentes

interface PaginationProps {
  currentPage: number; // 0-based
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Lógica para gerar os números das páginas
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Quantidade de botões numéricos visíveis

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostra a primeira página
      pages.push(0);

      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);

      // Ajusta se estiver no começo ou fim
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 2, 3);
      }
      if (currentPage >= totalPages - 3) {
        startPage = Math.max(1, totalPages - 4);
      }

      if (startPage > 1) {
        pages.push(-1); // -1 representa "..."
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 2) {
        pages.push(-1); // "..."
      }

      // Sempre mostra a última página
      pages.push(totalPages - 1);
    }
    return pages;
  };

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Mostrando <span className="font-medium text-gray-900 dark:text-white">{startItem}</span> a{' '}
        <span className="font-medium text-gray-900 dark:text-white">{endItem}</span> de{' '}
        <span className="font-medium text-gray-900 dark:text-white">{totalElements}</span> resultados
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-2"
          title="Anterior"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((page, index) => (
          page === -1 ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
            >
              {page + 1}
            </button>
          )
        ))}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-2"
          title="Próxima"
        >
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
