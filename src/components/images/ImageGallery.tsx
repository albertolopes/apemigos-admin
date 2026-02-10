'use client';

import React from 'react';
import { CloudinaryImage } from '@/lib/types';
import Button from '../ui/button/Button';
import ComponentCard from '../common/ComponentCard';

interface ImageGalleryProps {
    images: CloudinaryImage[];
    onDelete: (publicId: string) => void;
}

export default function ImageGallery({ images, onDelete }: ImageGalleryProps) {
    if (images.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                    Nenhuma imagem enviada nesta sessão.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
                <div
                    key={image.publicId}
                    className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                    <div className="aspect-square relative flex items-center justify-center bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                        <img
                            src={image.url}
                            alt={image.publicId}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    <div className="p-4">
                        <div className="flex flex-col gap-1 mb-3">
                            <span className="text-xs font-medium text-gray-400 uppercase truncate">
                                {image.format} • {Math.round(image.bytes / 1024)} KB
                            </span>
                            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={image.publicId}>
                                {image.publicId}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => window.open(image.url, '_blank')}
                            >
                                Abrir
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="text-error-500 hover:bg-error-50 border-error-100 hover:border-error-500"
                                onClick={() => onDelete(image.publicId)}
                            >
                                Excluir
                            </Button>
                        </div>
                    </div>

                    <button
                        className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-md shadow-sm border border-gray-100 dark:border-gray-700 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                            navigator.clipboard.writeText(image.url);
                            alert('Link copiado!');
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
