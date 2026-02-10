'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { Projeto } from '@/lib/types';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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

    const handleQuillChange = (content: string) => {
        setFormData((prev) => ({ ...prev, description: content }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
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
                <Label>Descrição Completa (Editor de Texto)</Label>
                <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden">
                    <ReactQuill
                        theme="snow"
                        value={formData.description || ''}
                        onChange={handleQuillChange}
                        style={{ height: '250px', marginBottom: '50px' }}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="cover">URL da Imagem de Capa</Label>
                <Input
                    type="text"
                    id="cover"
                    name="cover"
                    value={formData.cover || ''}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
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
