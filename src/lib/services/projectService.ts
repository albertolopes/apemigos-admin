import api from './api';
import type { Projeto, Page } from '../types';

export const getProjects = async (
  page = 0,
  size = 10,
  keyword = ''
): Promise<Page<Projeto>> => {
  const url = keyword ? '/projetos/search' : '/projetos';
  const params: any = {
    page,
    size,
  };
  if (keyword) {
    params.keyword = keyword;
  }

  const response = await api.get(url, {
    params,
  });
  return response.data;
};

export const createProject = async (
  project: Partial<Projeto>
): Promise<Projeto> => {
  const response = await api.post('/projetos', project);
  return response.data;
};

export const updateProject = async (
  id: number,
  project: Partial<Projeto>
): Promise<Projeto> => {
  const response = await api.put(`/projetos/${id}`, project);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projetos/${id}`);
};
