import api from './api';
import type { Page, AssociadoResponseDTO, StatusCarteirinha } from '../types';

export const getAssociados = async (
  page = 0,
  size = 10,
  keyword?: string
): Promise<Page<AssociadoResponseDTO>> => {
  const params: any = { page, size };
  if (keyword) {
    params.keyword = keyword;
  }

  const response = await api.get('/associados', { params });
  return response.data;
};

export const updateAssociadoStatus = async (
  id: number,
  status: StatusCarteirinha
): Promise<AssociadoResponseDTO> => {
  // O endpoint espera o enum no corpo. Enviamos como string JSON.
  const response = await api.patch(`/associados/${id}/status`, JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Função para criar associado (Multipart) - caso necessário no futuro
// export const createAssociado = async (formData: FormData) => { ... }
