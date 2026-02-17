'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../ui/table/index';
import Button from '../ui/button/Button';
import Badge from '../ui/badge/Badge';
import { AssociadoResponseDTO, StatusCarteirinha } from '@/lib/types';
import { EyeIcon } from '@/icons';

interface AssociadoTableProps {
  associados: AssociadoResponseDTO[];
  onView: (associado: AssociadoResponseDTO) => void;
}

const getStatusColor = (status: StatusCarteirinha) => {
  switch (status) {
    case 'APROVADA':
    case 'EXPEDIDA':
    case 'ENVIADA':
    case 'ENTREGUE':
      return 'success';
    case 'SOLICITADA':
    case 'EM_ANALISE':
    case 'EM_PRODUCAO':
      return 'warning';
    case 'PENDENTE_DOC':
    case 'CANCELADA':
    case 'VENCIDA':
      return 'error';
    default:
      return 'light';
  }
};

export default function AssociadoTable({ associados, onView }: AssociadoTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Nome
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  CPF
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Data Solicitação
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                  Ações
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {associados.length > 0 ? (
                associados.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 font-medium">
                      {item.nome} {item.sobrenome}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.cpf}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={getStatusColor(item.statusCarteirinha)}>
                        {item.statusCarteirinha}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => onView(item)} title="Ver Detalhes">
                          <EyeIcon className="w-4 h-4" /> Detalhes
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhum associado encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
