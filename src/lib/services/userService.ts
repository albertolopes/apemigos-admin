import api from './api';
import type { Usuario, Page } from '../types';

export const getUsers = async (
  page = 0,
  size = 10
): Promise<Page<Usuario>> => {
  const response = await api.get('/users', {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

export const createUser = async (user: Partial<Usuario>): Promise<Usuario> => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (
  id: number,
  user: Partial<Usuario>
): Promise<Usuario> => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};
