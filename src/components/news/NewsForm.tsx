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
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
      // Se já tem imagem, assume modo URL por padrão, mas permite mudar
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.title && !initialData?.id) {
      const newSlug = generateSlug(formData.title);
      setFormData((prev) => ({ ...prev, slug: newSlug }));
    }
  }, [formData.title, initialData?.id]);

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
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden">
      {/* Cabeçalho Fixo */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-20 sticky top-0">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {initialData?.id ? 'Editar Notícia' : 'Nova Notícia'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Preencha os campos abaixo para {initialData?.id ? 'atualizar a' : 'criar uma nova'} notícia.
        </p>
      </div>

      {/* Corpo Rolável */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              required
              placeholder="Digite o título da notícia"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug || ''}
              disabled
              placeholder="Gerado automaticamente"
              className="bg-gray-50 dark:bg-gray-900 cursor-not-allowed w-full opacity-70"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">Descrição Curta <span className="text-red-500">*</span></Label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription || ''}
            onChange={handleChange}
            rows={3}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-colors resize-none"
            placeholder="Um breve resumo que aparecerá nos cards de listagem..."
          />
        </div>

        <div className="space-y-2">
          <Label>Conteúdo Completo</Label>
          <div className="mt-1">
            <TiptapEditor
              content={formData.longDescription || ''}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Label>Imagem de Capa</Label>
          
          <div className="flex items-center gap-4 mb-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  imageMode === 'url'
                    ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Link URL
              </button>
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  imageMode === 'upload'
                    ? 'bg-white dark:bg-gray-600 text-brand-600 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Upload Arquivo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              {imageMode === 'url' ? (
                <Input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image || ''}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full"
                />
              ) : (
                <div className="space-y-2">
                  <FileInput onChange={handleFileUpload} className="w-full" />
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-brand-600 animate-pulse">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Enviando imagem...
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {formData.image ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm group">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=Erro+ao+carregar';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
              ) : (
                <div className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                  <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Sem imagem</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé Fixo */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 z-20 sticky bottom-0 flex justify-end gap-3 rounded-b-xl backdrop-blur-sm">
        <Button 
          variant="outline" 
          onClick={onCancel} 
          type="button" 
          disabled={isSaving || isUploading}
          className="min-w-[100px]"
        >
          Cancelar
        </Button>
        <Button 
          variant="primary" 
          type="submit" 
          disabled={isSaving || isUploading}
          className="min-w-[120px] shadow-lg shadow-brand-500/20"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
          ) : 'Salvar Notícia'}
        </Button>
      </div>
    </form>
  );
}
