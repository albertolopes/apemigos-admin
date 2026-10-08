import type { EventoInscricao } from '@/lib/types';

type AnswerValue = string | string[] | number | boolean | null | undefined;

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const answerToString = (value: AnswerValue) => {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined || value === '') return '';
  return String(value);
};

const findAnswer = (registration: EventoInscricao, keys: string[]) => {
  const normalizedKeys = keys.map(normalize);
  const answer = registration.respostas?.find((item) => {
    const chave = item.chave ? normalize(item.chave) : '';
    const label = normalize(item.label || '');
    return normalizedKeys.includes(chave) || normalizedKeys.includes(label);
  });
  return answerToString(answer?.valor);
};

export const getRegistrationDisplayData = (registration: EventoInscricao) => ({
  nome: registration.nome || findAnswer(registration, ['nome', 'nome_completo', 'nome completo', 'name']),
  email: registration.email || findAnswer(registration, ['email', 'e_mail', 'e-mail']),
  telefone: registration.telefone || findAnswer(registration, ['telefone', 'telefone_contato', 'celular', 'phone']),
  cpf: registration.cpf || findAnswer(registration, ['cpf']),
  dataInscricao: registration.dataInscricao || registration.createdAt,
  status: registration.status || 'N/A',
});

export const formatAnswerValue = (value: string | string[] | number | boolean | null | undefined) => {
  const formatted = answerToString(value);
  return formatted || 'N/A';
};
