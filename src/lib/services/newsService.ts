import api from './api';
import type { Noticia, NoticiaConteudo, Page } from '../types';

// This is the payload for creating the content, matching your specification.
interface NoticiaConteudoCreatePayload {
  noticia: Noticia;
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

  // 2. Sanitize the returned news object to pass only required fields
  // The backend might reject the request if extra fields like 'date' are sent
  const sanitizedNews = {
    id: newNews.id,
    title: newNews.title,
    shortDescription: newNews.shortDescription,
    image: newNews.image,
    slug: newNews.slug,
  };

  // 3. Use the sanitized object to create the content
  await createNewsContent({
    noticia: sanitizedNews as Noticia,
    longDescription: newsData.longDescription,
  });

  return newNews;
};

export const getNews = async (
  page = 0,
  size = 10,
  keyword = ''
): Promise<Page<Noticia>> => {
  const url = keyword ? '/noticias/search' : '/noticias';
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

export const getNewsContent = async (id: number): Promise<NoticiaConteudo> => {
  const response = await api.get(`/noticias/conteudo/${id}`);
  return response.data;
};

// Internal function to update the news item
const updateNewsItem = async (
  id: number,
  news: Partial<Noticia>
): Promise<Noticia> => {
  const response = await api.put(`/noticias/${id}`, news);
  return response.data;
};

// Internal function to update the news content
const updateNewsContent = async (
  id: number,
  content: NoticiaConteudoCreatePayload
): Promise<NoticiaConteudo> => {
  const response = await api.put(`/noticias/conteudo/${id}`, content);
  return response.data;
};

export const updateNewsWithContent = async (
  id: number,
  newsData: Partial<Noticia> & { longDescription: string }
): Promise<Noticia> => {
  // 1. Update the news item
  const updatedNews = await updateNewsItem(id, {
    title: newsData.title,
    shortDescription: newsData.shortDescription,
    image: newsData.image,
    slug: newsData.slug,
  });
  // 2. Sanitize the returned news object
  const sanitizedNews = {
    id: updatedNews.id,
    title: updatedNews.title,
    shortDescription: updatedNews.shortDescription,
    image: updatedNews.image,
    slug: updatedNews.slug,
  };

  // 3. Update the content
  await updateNewsContent(id, {
    noticia: sanitizedNews as Noticia,
    longDescription: newsData.longDescription,
  });

  return updatedNews;
};

export const updateNews = async (
  id: number,
  news: Partial<Noticia>
): Promise<Noticia> => {
  return updateNewsItem(id, news);
};

export const deleteNews = async (id: number): Promise<void> => {
  await api.delete(`/noticias/${id}`);
};
