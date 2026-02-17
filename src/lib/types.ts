export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  first?: boolean;
  last?: boolean;
  size?: number;
  empty?: boolean;
}

export type NoticiaStatus = 'APROVADO' | 'PENDENTE';

export interface Noticia {
  id: number;
  image: string;
  title: string;
  date: string;
  shortDescription: string;
  slug: string;
  status: NoticiaStatus;
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
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'USUARIO' | 'ADMIN' | 'SERVICE';
  isActive: boolean;
}

// --- Tipos para Carteirinha ---

export type StatusCarteirinha =
  | 'SOLICITADA'
  | 'EM_ANALISE'
  | 'PENDENTE_DOC'
  | 'APROVADA'
  | 'EM_PRODUCAO'
  | 'EXPEDIDA'
  | 'ENVIADA'
  | 'ENTREGUE'
  | 'CANCELADA'
  | 'VENCIDA';

export interface AssociadoResponseDTO {
  id: number;
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  email: string;
  telefoneContato: string;
  telefoneEmergencia: string;
  nomeContatoEmergencia: string;
  medicoResponsavel: string;
  telefoneMedico: string;
  possuiConvenio: boolean;
  convenioNome: string;
  cidade: string;
  estado: string;
  bairro: string;
  logradouro: string;
  complemento: string;
  cep: string;
  observacoes: string;
  createdAt: string;
  statusCarteirinha: StatusCarteirinha;
}

export interface AssociadoRequisicaoDTO {
  nome: string;
  sobrenome: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  email: string;
  telefoneContato: string;
  laudo?: File;
  foto3x4?: File;
  documento?: File;
}

export interface AssociadoFile {
  id: number;
  associadoId: number;
  fieldName: string | null;
  originalName: string | null;
  contentType: string | null;
  size: number | null;
  cloudPublicId: string;
  cloudUrl: string;
  cloudFolder: string; // Nome do arquivo original parece estar aqui no seu exemplo
  cloudSuccess: boolean | null;
  cloudMessage: string | null;
  createdAt: string | null;
}

// --- Novo Tipo para Imagens (Cloudinary) ---
export interface CloudinaryImage {
  success: boolean;
  url: string;
  publicId: string;
  folder: string;
  message: string;
  fileSize?: number;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
  optimizedFormat?: string;
  contentType?: string;
  cloudName?: string;
}
