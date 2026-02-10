'use client';

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../ui/button/Button';
import Input from '../form/input/InputField';
import Label from '../form/Label';
import ComponentCard from '../common/ComponentCard';
import { uploadImage, uploadImageFromUrl } from '@/lib/services/imageService';
import { CloudinaryImage } from '@/lib/types';
import { useToast } from '@/hooks/useToast';

interface ImageUploadProps {
    onUploadSuccess: (image: CloudinaryImage) => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { addToast } = useToast();

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploading(true);
        try {
            const result = await uploadImage(acceptedFiles[0]);
            onUploadSuccess(result.mappedImage);
            addToast({
                variant: 'success',
                title: 'Upload concluído',
                message: 'A imagem foi enviada com sucesso.',
            });
        } catch (error) {
            console.error('Upload error:', error);
            addToast({
                variant: 'error',
                title: 'Erro no upload',
                message: 'Não foi possível enviar o arquivo.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.svg'],
        },
        multiple: false,
    });

    const handleUrlUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl.trim()) return;

        setIsUploading(true);
        try {
            const result = await uploadImageFromUrl(imageUrl);
            onUploadSuccess(result.mappedImage);
            setImageUrl('');
            addToast({
                variant: 'success',
                title: 'Upload concluído',
                message: 'A imagem via URL foi processada com sucesso.',
            });
        } catch (error) {
            console.error('URL Upload error:', error);
            addToast({
                variant: 'error',
                title: 'Erro no upload',
                message: 'Não foi possível processar a URL da imagem.',
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ComponentCard title="Upload de Arquivo">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                        : 'border-gray-200 hover:border-blue-400 dark:border-gray-700'
                        }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <svg
                            className="w-12 h-12 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-400">
                            {isUploading ? 'Enviando...' : 'Arraste uma imagem ou clique para selecionar'}
                        </p>
                        <span className="text-xs text-gray-500 mt-2">
                            Suporta PNG, JPG, WebP e SVG
                        </span>
                    </div>
                </div>
            </ComponentCard>

            <ComponentCard title="Upload via URL">
                <form onSubmit={handleUrlUpload} className="space-y-4">
                    <div>
                        <Label htmlFor="image-url">Link da Imagem</Label>
                        <Input
                            id="image-url"
                            type="url"
                            placeholder="https://exemplo.com/imagem.png"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-full"
                        disabled={isUploading || !imageUrl.trim()}
                    >
                        {isUploading ? 'Processando...' : 'Enviar URL'}
                    </Button>
                    <p className="text-xs text-center text-gray-500 mt-4 italic">
                        A imagem será processada e salva no Cloudinary.
                    </p>
                </form>
            </ComponentCard>
        </div>
    );
}
