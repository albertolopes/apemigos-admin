export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export type NoticiaStatus = 'APROVADO' | 'PENDENTE';

export interface Noticia {
  id: number;
  image: string;
  title: string;
  date: string;
  shortDescription: string;
  slug: string;
  status: NoticiaStatus; // Novo campo
  createdAt?: string;
  updatedAt?: string;
}

export interface NoticiaConteudo {
  id: number;
  noticia: Noticia;
  longDescription: string;
}

export interface Projeto {
  id: number;
  title: string;
  shortDescription: string;
  cover: string;
  slug: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'USUARIO' | 'ADMIN' | 'SERVICE';
  isActive: boolean;
}
