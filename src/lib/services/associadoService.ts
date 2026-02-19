import api from './api';
import type { Page, AssociadoResponseDTO, StatusCarteirinha, AssociadoFile } from '../types';

export const getAssociados = async (
  page = 0,
  size = 10,
  keyword?: string,
  status?: StatusCarteirinha | '' // Adicionado parâmetro status
): Promise<Page<AssociadoResponseDTO>> => {
  const params: any = { page, size };
  if (keyword) {
    params.keyword = keyword;
  }
  if (status) {
    params.status = status;
  }

  const response = await api.get('/associados', { params });
  return response.data;
};

export const updateAssociadoStatus = async (
  id: number,
  status: StatusCarteirinha
): Promise<AssociadoResponseDTO> => {
  const response = await api.patch(`/associados/${id}/status`, JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const getAssociadoFiles = async (id: number): Promise<AssociadoFile[]> => {
  const response = await api.get(`/associados/${id}/files`);
  return response.data;
};
