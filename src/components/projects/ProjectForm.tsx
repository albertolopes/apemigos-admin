'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { Projeto } from '@/lib/types';
import { uploadImage } from '@/lib/services/imageService';
import { useToast } from '@/hooks/useToast';

// Usando o mesmo editor do NewsForm para consistência
const TiptapEditor = dynamic(() => import('../ui/editor/TiptapEditor'), { ssr: false });

interface ProjectFormProps {
    onSave: (project: Partial<Projeto>) => Promise<void>;
    onCancel: () => void;
    initialData: Partial<Projeto> | null;
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

export default function ProjectForm({ onSave, onCancel, initialData, isSaving }: ProjectFormProps) {
    const [formData, setFormData] = useState<Partial<Projeto>>({
        title: '',
        shortDescription: '',
        description: '',
        cover: '',
        slug: '',
    });

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
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
        setFormData((prev) => ({ ...prev, description: content }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const response = await uploadImage(file);
            if (response.success) {
                setFormData((prev) => ({ ...prev, cover: response.url }));
                addToast({
                    variant: 'success',
                    title: 'Upload concluído',
                    message: 'Imagem enviada com sucesso.',
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            addToast({
                variant: 'error',
                title: 'Erro no upload',
                message: 'Não foi possível enviar a imagem.',
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                {initialData?.id ? 'Editar Projeto' : 'Adicionar Projeto'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="title">Título do Projeto</Label>
                    <Input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Rifa Solidária"
                    />
                </div>
                <div>
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                        type="text"
                        id="slug"
                        name="slug"
                        value={formData.slug || ''}
                        onChange={handleChange}
                        placeholder="Gerado automaticamente"
                        className={!initialData?.id ? "bg-gray-100 cursor-not-allowed" : ""}
                        disabled={!initialData?.id}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="shortDescription">Resumo (Exibido no Card)</Label>
                <textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={formData.shortDescription || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Uma frase curta que resume o projeto"
                />
            </div>

            <div>
                <Label>Descrição Completa</Label>
                <div className="mb-4">
                    <TiptapEditor
                        content={formData.description || ''}
                        onChange={handleEditorChange}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="cover">Imagem de Capa</Label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        id="cover"
                        name="cover"
                        value={formData.cover || ''}
                        onChange={handleChange}
                        placeholder="URL da imagem ou faça upload"
                        className="flex-1"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleUploadClick}
                        disabled={isUploading || isSaving}
                        className="whitespace-nowrap"
                    >
                        {isUploading ? 'Enviando...' : 'Upload'}
                    </Button>
                </div>
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
