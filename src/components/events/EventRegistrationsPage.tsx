'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import Pagination from '@/components/common/Pagination';
import TableLoading from '@/components/ui/table/TableLoading';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/useToast';
import {
  getEvento,
  getEventoCampos,
  getEventoInscricao,
  getEventoInscricoes,
  getEventoInscricoesCount,
} from '@/lib/services/eventService';
import type { Evento, EventoCampo, EventoInscricao, Page } from '@/lib/types';
import { formatDateTime } from './eventUtils';
import { formatAnswerValue, getRegistrationDisplayData } from './registrationUtils';

const initialFilters: Record<string, string> = { keyword: '', dataInicio: '', dataFim: '' };

const normalizeCount = (value: unknown) => {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    const candidates = [
      objectValue.count,
      objectValue.total,
      objectValue.totalInscricoes,
      objectValue.totalElements,
      objectValue.quantidade,
    ];
    const numberValue = candidates.find((item): item is number => typeof item === 'number');
    if (numberValue !== undefined) return numberValue;
  }
  return 0;
};

export default function EventRegistrationsPage({ eventId }: { eventId: number }) {
  const [event, setEvent] = useState<Evento | null>(null);
  const [fields, setFields] = useState<EventoCampo[]>([]);
  const [registrations, setRegistrations] = useState<EventoInscricao[]>([]);
  const [page, setPage] = useState<Page<EventoInscricao> | null>(null);
  const [count, setCount] = useState(0);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const fetchRegistrations = useCallback(async (pageNumber = 0) => {
    setIsLoading(true);
    try {
      const [pageResponse, countResponse] = await Promise.all([
        getEventoInscricoes(eventId, { ...appliedFilters, page: pageNumber, size: 10 }),
        getEventoInscricoesCount(eventId),
      ]);
      const contentWithAnswers = await Promise.all(
        pageResponse.content.map(async (registration) => {
          if (registration.respostas?.length) return registration;
          try {
            return await getEventoInscricao(eventId, registration.id);
          } catch (error) {
            console.error(`Erro ao carregar respostas da inscrição ${registration.id}:`, error);
            return registration;
          }
        })
      );
      setRegistrations(contentWithAnswers);
      setPage(pageResponse);
      setCount(normalizeCount(countResponse));
    } catch (error) {
      console.error('Erro ao buscar inscrições:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível carregar as inscrições.' });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, appliedFilters, eventId]);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsEventLoading(true);
      try {
        const [eventResponse, fieldsResponse] = await Promise.all([
          getEvento(eventId),
          getEventoCampos(eventId),
        ]);
        setEvent(eventResponse);
        setFields(fieldsResponse.filter((field) => field.ativo).sort((a, b) => a.ordem - b.ordem));
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
        addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível carregar o evento.' });
      } finally {
        setIsEventLoading(false);
      }
    };
    fetchEvent();
  }, [addToast, eventId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const setFilter = (key: keyof typeof initialFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = (event: React.FormEvent) => {
    event.preventDefault();
    setAppliedFilters(filters);
  };

  const getDynamicAnswer = (registration: EventoInscricao, field: EventoCampo) => {
    const answer = registration.respostas?.find((item) => {
      if (field.id && item.campoId === field.id) return true;
      return item.chave === field.chave || item.label === field.label;
    });
    return formatAnswerValue(answer?.valor);
  };

  const getRegistrationsWithAnswers = async (items: EventoInscricao[]) => {
    return Promise.all(
      items.map(async (registration) => {
        if (registration.respostas?.length) return registration;
        try {
          return await getEventoInscricao(eventId, registration.id);
        } catch (error) {
          console.error(`Erro ao carregar respostas da inscrição ${registration.id}:`, error);
          return registration;
        }
      })
    );
  };

  const csvEscape = (value: string | number | null | undefined) => {
    const stringValue = value === null || value === undefined ? '' : String(value);
    return `"${stringValue.replace(/"/g, '""')}"`;
  };

  const downloadCsv = async () => {
    setIsExporting(true);
    try {
      const pageSize = 100;
      const firstPage = await getEventoInscricoes(eventId, { ...appliedFilters, page: 0, size: pageSize });
      const pages = [firstPage];

      for (let pageNumber = 1; pageNumber < firstPage.totalPages; pageNumber += 1) {
        pages.push(await getEventoInscricoes(eventId, { ...appliedFilters, page: pageNumber, size: pageSize }));
      }

      const allRegistrations = await getRegistrationsWithAnswers(pages.flatMap((item) => item.content));
      const headers = ['ID', ...fields.map((field) => field.label), 'Data da inscrição', 'Status'];
      const rows = allRegistrations.map((registration) => {
        const displayData = getRegistrationDisplayData(registration);
        return [
          registration.id,
          ...fields.map((field) => getDynamicAnswer(registration, field)),
          formatDateTime(displayData.dataInscricao),
          displayData.status,
        ];
      });

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => csvEscape(cell)).join(';'))
        .join('\n');
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const eventSlug = event?.slug || `evento-${eventId}`;
      link.href = url;
      link.download = `inscricoes-${eventSlug}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      addToast({ variant: 'success', title: 'Sucesso', message: 'CSV gerado com sucesso.' });
    } catch (error) {
      console.error('Erro ao gerar CSV:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível gerar o CSV.' });
    } finally {
      setIsExporting(false);
    }
  };

  const renderDynamicFilter = (field: EventoCampo) => {
    const value = filters[field.chave] || '';
    const commonClass = 'h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90';

    if (['SELECT', 'RADIO', 'CHECKBOX'].includes(field.tipo)) {
      return (
        <select
          key={field.chave}
          value={value}
          onChange={(event) => setFilter(field.chave, event.target.value)}
          className={commonClass}
        >
          <option value="">{field.label}</option>
          {field.opcoes.map((option) => (
            <option key={option.valor} value={option.valor}>{option.label}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        key={field.chave}
        type={field.tipo === 'DATE' ? 'date' : field.tipo === 'NUMBER' ? 'number' : 'text'}
        value={value}
        onChange={(event) => setFilter(field.chave, event.target.value)}
        placeholder={field.label}
        className={commonClass}
      />
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Inscrições</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isEventLoading ? 'Carregando evento...' : event?.titulo || 'Evento'} | Total: {count.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadCsv} disabled={isExporting || isLoading}>
            {isExporting ? 'Gerando CSV...' : 'Baixar CSV'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/eventos')}>Voltar</Button>
        </div>
      </div>

      <form onSubmit={applyFilters} className="mb-6 grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03] md:grid-cols-3 lg:grid-cols-4">
        <input value={filters.keyword || ''} onChange={(event) => setFilter('keyword', event.target.value)} placeholder="Buscar" className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        {fields.map(renderDynamicFilter)}
        <input type="date" value={filters.dataInicio} onChange={(event) => setFilter('dataInicio', event.target.value)} className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <input type="date" value={filters.dataFim} onChange={(event) => setFilter('dataFim', event.target.value)} className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90" />
        <Button type="submit" variant="outline">Filtrar</Button>
      </form>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {['ID', ...fields.map((field) => field.label), 'Data da inscrição', 'Status', 'Ações'].map((header) => (
                  <TableCell key={header} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{header}</TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                <TableLoading columns={8} />
              ) : registrations.length > 0 ? (
                registrations.map((item) => {
                  const displayData = getRegistrationDisplayData(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{item.id}</TableCell>
                      {fields.map((field) => (
                        <TableCell key={field.id || field.chave} className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">
                          {getDynamicAnswer(item, field)}
                        </TableCell>
                      ))}
                      <TableCell className="px-5 py-4 text-theme-sm text-gray-500 dark:text-gray-400">{formatDateTime(displayData.dataInscricao)}</TableCell>
                      <TableCell className="px-5 py-4"><Badge size="sm" color="info">{displayData.status}</Badge></TableCell>
                      <TableCell className="px-5 py-4">
                        <Link href={`/eventos/${eventId}/inscricoes/${item.id}`}>
                          <Button size="sm" variant="outline">Detalhes</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={fields.length + 4} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">Nenhuma inscrição encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {page && (
        <Pagination currentPage={page.number} totalPages={page.totalPages} totalElements={page.totalElements} pageSize={page.size || 10} onPageChange={fetchRegistrations} />
      )}
    </div>
  );
}
