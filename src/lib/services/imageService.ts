import api from './api';
import { CloudinaryImage } from '../types'; // Usando a interface central

export interface UploadResponse {
  success: boolean;
  url: string;
  public_id: string;
  folder: string;
  message: string;
}

export const uploadImage = async (file: File, folder: string = 'noticias'): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/images/upload', formData, {
    params: { folder },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const uploadImageFromUrl = async (url: string, folder: string = 'noticias'): Promise<UploadResponse> => {
  const response = await api.post('/images/upload-from-url', null, {
    params: { url, folder },
  });
  return response.data;
};

export const deleteImage = async (url: string): Promise<void> => {
  await api.delete('/images/delete', {
    params: { url },
  });
};

// A API retorna snake_case, mas a função agora retorna a interface CloudinaryImage (camelCase)
export const getImageDetails = async (publicId: string): Promise<CloudinaryImage> => {
  const response = await api.get(`/images/details/${publicId}`);
  const data = response.data;

  // Mapeia a resposta da API para a nossa interface camelCase
  return {
    success: true, // Assumindo sucesso se a chamada não falhar
    url: data.url,
    publicId: data.public_id,
    folder: data.folder,
    message: 'Detalhes recuperados',
    fileSize: data.bytes,
    contentType: data.format,
    cloudName: data.cloud_name,
    // Adicione outros campos se necessário
  };
};

export const checkImageServiceHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await api.get('/images/health');
  return response.data;
};
