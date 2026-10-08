import api from './api';
import type {
  Evento,
  EventoCampo,
  EventoInscricao,
  EventoStatus,
  Page,
} from '../types';

export interface EventoListParams {
  keyword?: string;
  status?: EventoStatus | '';
  page?: number;
  size?: number;
}

export interface InscricaoListParams {
  keyword?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  size?: number;
  [key: string]: string | number | undefined;
}

export const getEventos = async ({
  keyword = '',
  status = '',
  page = 0,
  size = 10,
}: EventoListParams = {}): Promise<Page<Evento>> => {
  const response = await api.get('/admin/eventos', {
    params: { keyword, status, page, size },
  });
  return response.data;
};

export const getEvento = async (id: number): Promise<Evento> => {
  const response = await api.get(`/admin/eventos/${id}`);
  return response.data;
};

export const createEvento = async (evento: Partial<Evento>): Promise<Evento> => {
  const response = await api.post('/admin/eventos', evento);
  return response.data;
};

export const updateEvento = async (
  id: number,
  evento: Partial<Evento>
): Promise<Evento> => {
  const response = await api.put(`/admin/eventos/${id}`, evento);
  return response.data;
};

export const updateEventoStatus = async (
  id: number,
  status: EventoStatus
): Promise<Evento> => {
  const response = await api.patch(`/admin/eventos/${id}/status`, JSON.stringify(status), {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const getEventoCampos = async (eventoId: number): Promise<EventoCampo[]> => {
  const response = await api.get(`/admin/eventos/${eventoId}/campos`);
  return response.data;
};

export const updateEventoCampos = async (
  eventoId: number,
  campos: EventoCampo[]
): Promise<EventoCampo[]> => {
  const response = await api.put(`/admin/eventos/${eventoId}/campos`, campos);
  return response.data;
};

export const getEventoInscricoes = async (
  eventoId: number,
  {
    keyword = '',
    cpf = '',
    email = '',
    telefone = '',
    dataInicio = '',
    dataFim = '',
    page = 0,
    size = 10,
    ...dynamicFilters
  }: InscricaoListParams = {}
): Promise<Page<EventoInscricao>> => {
  const response = await api.get(`/admin/eventos/${eventoId}/inscricoes`, {
    params: { keyword, cpf, email, telefone, dataInicio, dataFim, ...dynamicFilters, page, size },
  });
  return response.data;
};

export const getEventoInscricoesCount = async (eventoId: number): Promise<number> => {
  const response = await api.get(`/admin/eventos/${eventoId}/inscricoes/count`);
  return response.data;
};

export const getEventoInscricao = async (
  eventoId: number,
  inscricaoId: number
): Promise<EventoInscricao> => {
  const response = await api.get(`/admin/eventos/${eventoId}/inscricoes/${inscricaoId}`);
  return response.data;
};
