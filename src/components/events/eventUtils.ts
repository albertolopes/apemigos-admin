import type { EventoStatus } from '@/lib/types';

export const EVENTO_STATUS: EventoStatus[] = [
  'RASCUNHO',
  'PUBLICADO',
  'OCULTO',
  'ENCERRADO',
  'CANCELADO',
];

export const formatDate = (value?: string | null) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleDateString('pt-BR');
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('pt-BR');
};

export const toDateTimeLocal = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export const fromDateTimeLocal = (value: string) => value || null;

export const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const makeSlug = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const statusBadgeColor = (status?: EventoStatus) => {
  if (status === 'PUBLICADO') return 'success';
  if (status === 'CANCELADO') return 'error';
  if (status === 'OCULTO' || status === 'ENCERRADO') return 'light';
  return 'warning';
};
