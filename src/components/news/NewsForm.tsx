'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import FileInput from '../form/input/FileInput';
import { Noticia } from '@/lib/types';
import { uploadImage } from '@/lib/services/imageService';

// Importação dinâmica do TiptapEditor para evitar erros de SSR
const TiptapEditor = dynamic(() => import('../ui/editor/TiptapEditor'), { ssr: false });

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

  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);

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

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, longDescription: content }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await uploadImage(file);
      if (response.success) {
        setFormData((prev) => ({ ...prev, image: response.url }));
      } else {
        alert('Erro no upload: ' + response.message);
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {/* Cabeçalho Fixo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 rounded-t-xl">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {initialData?.id ? 'Editar Notícia' : 'Adicionar Notícia'}
        </h2>
      </div>

      {/* Corpo Rolável */}
      <div className="p-6 space-y-4 overflow-y-auto flex-1">
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
          <div className="mb-4">
            <TiptapEditor
              content={formData.longDescription || ''}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        <div>
          <Label>Imagem de Capa</Label>
          <div className="flex gap-4 mb-2">
            <button
              type="button"
              onClick={() => setImageMode('url')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                imageMode === 'url'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              Colar URL
            </button>
            <button
              type="button"
              onClick={() => setImageMode('upload')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                imageMode === 'upload'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              Fazer Upload
            </button>
          </div>

          {imageMode === 'url' ? (
            <Input
              type="text"
              id="image"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          ) : (
            <div className="space-y-2">
              <FileInput onChange={handleFileUpload} />
              {isUploading && <p className="text-sm text-blue-500">Enviando imagem...</p>}
            </div>
          )}

          {formData.image && (
            <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Rodapé Fixo */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 z-10 rounded-b-xl flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} type="button" disabled={isSaving || isUploading}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={isSaving || isUploading}>
          {isSaving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}
