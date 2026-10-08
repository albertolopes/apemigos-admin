'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import Pagination from '@/components/common/Pagination';
import TableLoading from '@/components/ui/table/TableLoading';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/useToast';
import { getEventos, updateEventoStatus } from '@/lib/services/eventService';
import type { Evento, EventoStatus, Page } from '@/lib/types';
import { EVENTO_STATUS, formatDate, statusBadgeColor } from './eventUtils';

export default function EventListPage() {
  const [events, setEvents] = useState<Evento[]>([]);
  const [page, setPage] = useState<Page<Evento> | null>(null);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<EventoStatus | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const router = useRouter();
  const { addToast } = useToast();

  const fetchEvents = useCallback(async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const response = await getEventos({ keyword, status, page: pageNumber, size: 10 });
      setEvents(response.content);
      setPage(response);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível carregar os eventos.' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, keyword, status]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilter = (event: React.FormEvent) => {
    event.preventDefault();
    fetchEvents(0);
  };

  const handleStatusChange = async (id: number, nextStatus: EventoStatus) => {
    setUpdatingId(id);
    try {
      await updateEventoStatus(id, nextStatus);
      await fetchEvents(page?.number || 0);
      addToast({ variant: 'success', title: 'Sucesso', message: 'Status atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar status do evento:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível atualizar o status.' });
    } finally {
      setUpdatingId(null);
    }
  };

  const publicPath = (slug?: string | null) => slug ? `/eventos/${slug}` : '';

  const copyPublicLink = async (event: Evento) => {
    if (!event.slug) {
      addToast({ variant: 'error', title: 'Erro', message: 'Este evento ainda não possui slug.' });
      return;
    }

    const path = publicPath(event.slug);
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      addToast({ variant: 'success', title: 'Sucesso', message: 'Link público copiado.' });
    } catch (error) {
      console.error('Erro ao copiar link público:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível copiar o link público.' });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Eventos</h1>
        <Link href="/eventos/novo">
          <Button variant="primary">Criar novo evento</Button>
        </Link>
      </div>

      <form onSubmit={handleFilter} className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] md:grid-cols-[1fr_220px_auto]">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Buscar por título, local ou descrição"
          className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as EventoStatus | '')}
          className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
        >
          <option value="">Todos os status</option>
          {EVENTO_STATUS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <Button type="submit" variant="outline">Filtrar</Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['Título', 'Status', 'Data do evento', 'Período de inscrições', 'Inscrições', 'Ações'].map((header) => (
                  <TableCell key={header} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                <TableLoading columns={6} />
              ) : events.length > 0 ? (
                events.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-5 py-4 text-theme-sm font-medium text-gray-700 dark:text-gray-300">
                      <div>{item.titulo}</div>
                      {item.slug && (
                        <div className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400">{publicPath(item.slug)}</div>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-4"><Badge size="sm" color={statusBadgeColor(item.status)}>{item.status}</Badge></TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{formatDate(item.dataInicio)}{item.dataFim ? ` a ${formatDate(item.dataFim)}` : ''}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{formatDate(item.inicioInscricoes)} a {formatDate(item.fimInscricoes)}</TableCell>
                    <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{(item.totalInscricoes || 0).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex min-w-[560px] flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => router.push(`/eventos/${item.id}/editar`)}>Editar</Button>
                        <Button size="sm" variant="outline" onClick={() => router.push(`/eventos/${item.id}/formulario`)}>Formulário</Button>
                        <Button size="sm" variant="outline" onClick={() => router.push(`/eventos/${item.id}/inscricoes`)}>Inscrições</Button>
                        <Button size="sm" variant="outline" onClick={() => copyPublicLink(item)} disabled={!item.slug}>Copiar link público</Button>
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(event) => handleStatusChange(item.id, event.target.value as EventoStatus)}
                          className="h-10 rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-700 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                          title="Alterar status"
                        >
                          {EVENTO_STATUS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                    Nenhum evento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {page && (
        <Pagination
          currentPage={page.number}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          pageSize={page.size || 10}
          onPageChange={fetchEvents}
        />
      )}
    </div>
  );
}
