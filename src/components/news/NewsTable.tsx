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
import { Noticia, NoticiaStatus } from '@/lib/types';
import { EyeIcon, CheckLineIcon, CloseLineIcon } from '@/icons';
import TableLoading from '../ui/table/TableLoading'; // Importando loading

interface NewsTableProps {
  news: Noticia[];
  onEdit: (news: Noticia) => void;
  onDelete: (id: number) => void;
  onPreview: (news: Noticia) => void;
  onStatusChange: (id: number, status: NoticiaStatus) => void;
  isLoading?: boolean; // Nova prop
}

export default function NewsTable({ news, onEdit, onDelete, onPreview, onStatusChange, isLoading }: NewsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Capa
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Título
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Data Notícia
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Criado em
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                  Ações
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                <TableLoading columns={6} />
              ) : news.length > 0 ? (
                news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-400">
                            N/A
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 font-medium">
                      {item.title}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge
                        size="sm"
                        color={item.status === 'APROVADO' ? 'success' : 'warning'}
                      >
                        {item.status || 'PENDENTE'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => onPreview(item)} title="Pré-visualizar">
                          <EyeIcon className="w-4 h-4" />
                        </Button>
                        
                        {item.status === 'APROVADO' ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-warning-500 hover:bg-warning-50"
                            onClick={() => onStatusChange(item.id, 'PENDENTE')}
                            title="Tornar Pendente"
                          >
                            <CloseLineIcon className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-success-500 hover:bg-success-50"
                            onClick={() => onStatusChange(item.id, 'APROVADO')}
                            title="Aprovar"
                          >
                            <CheckLineIcon className="w-4 h-4" />
                          </Button>
                        )}

                        <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                          Editar
                        </Button>
                        <Button size="sm" variant="outline" className="text-error-500 hover:bg-error-50" onClick={() => onDelete(item.id)}>
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhuma notícia encontrada.
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
