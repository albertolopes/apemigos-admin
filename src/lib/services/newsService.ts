import api from './api';
import type { Noticia, NoticiaConteudo, Page, NoticiaStatus } from '../types';

// This is the payload for creating the content, matching your specification.
interface NoticiaConteudoCreatePayload {
  noticia: {
    id: number;
  };
  longDescription: string;
}

// Internal function to create the Noticia entity
const createNews = async (news: Partial<Noticia>): Promise<Noticia> => {
  const response = await api.post('/noticias', news);
  return response.data;
};

// Internal function to create the news content
const createNewsContent = async (
  content: NoticiaConteudoCreatePayload
): Promise<NoticiaConteudo> => {
  const response = await api.post('/noticias/conteudo', content);
  return response.data;
};

// Public function that orchestrates the two-step creation process
export const createNewsWithContent = async (
  newsData: Partial<Noticia> & { longDescription: string }
): Promise<Noticia> => {
  // 1. Create the news item
  const newNews = await createNews({
    title: newsData.title,
    shortDescription: newsData.shortDescription,
    image: newsData.image,
    slug: newsData.slug,
  });

  // 2. Use the returned ID to create the content with the correct payload structure
  await createNewsContent({
    noticia: { id: newNews.id }, // Correctly passing the nested ID
    longDescription: newsData.longDescription,
  });

  return newNews;
};

export const getNews = async (
  page = 0,
  size = 10
): Promise<Page<Noticia>> => {
  const response = await api.get('/noticias', {
    params: {
      page,
      size,
    },
  });
  return response.data;
};

export const updateNews = async (
  id: number,
  news: Partial<Noticia>
): Promise<Noticia> => {
  const response = await api.put(`/noticias/${id}`, news);
  return response.data;
};

export const updateNewsStatus = async (
  id: number,
  status: NoticiaStatus
): Promise<Noticia> => {
  // O endpoint espera o enum no corpo. Enviamos como string JSON.
  // É importante definir o Content-Type como application/json para que o backend entenda.
  const response = await api.patch(`/noticias/${id}/status`, JSON.stringify(status), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const deleteNews = async (id: number): Promise<void> => {
  await api.delete(`/noticias/${id}`);
};
