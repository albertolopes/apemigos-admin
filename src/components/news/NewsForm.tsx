'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Input from '../form/input/InputField'; // Caminho corrigido
import { Noticia } from '@/lib/types';
import 'react-quill-new/dist/quill.snow.css';

// Importação dinâmica do ReactQuill para evitar erros de SSR
// Usando react-quill-new que é compatível com React 19
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface NewsFormProps {
  onSave: (news: Partial<Noticia> & { longDescription?: string }) => Promise<void>;
  onCancel: () => void;
  initialData: (Partial<Noticia> & { longDescription?: string }) | null;
  isSaving: boolean;
}

const generateSlug = (title: string): string => {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

export default function NewsForm({ onSave, onCancel, initialData, isSaving }: NewsFormProps) {
  const [formData, setFormData] = useState<Partial<Noticia> & { longDescription?: string }>({
    title: '',
    shortDescription: '',
    image: '',
    slug: '',
    longDescription: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.title) {
      const newSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (content: string) => {
    setFormData((prev) => ({ ...prev, longDescription: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {initialData?.id ? 'Editar Notícia' : 'Adicionar Notícia'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            required
            placeholder="Digite o título da notícia"
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug || ''}
            disabled
            placeholder="Gerado automaticamente"
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Descrição Curta</Label>
        <textarea
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription || ''}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Resumo para exibição em cards"
        />
      </div>

      <div>
        <Label>Conteúdo Completo</Label>
        <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
          <ReactQuill
            theme="snow"
            value={formData.longDescription || ''}
            onChange={handleQuillChange}
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">URL da Imagem</Label>
        <Input
          type="text"
          id="image"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSaving}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
