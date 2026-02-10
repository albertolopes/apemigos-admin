'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from '@/components/images/ImageUpload';
import ImageGallery from '@/components/images/ImageGallery';
import { deleteImage, getImageDetails, checkImageServiceHealth } from '@/lib/services/imageService';
import { CloudinaryImage } from '@/lib/types';
import { useToast } from '@/hooks/useToast';
import ConfirmDialog from '@/components/ui/modal/ConfirmDialog';
import Input from '@/components/form/input/InputField';
import Button from '@/components/ui/button/Button';

export default function ImagesPage() {
    const [sessionImages, setSessionImages] = useState<CloudinaryImage[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<string | null>(null);
    const [searchId, setSearchId] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [serviceStatus, setServiceStatus] = useState<'checking' | 'up' | 'down'>('checking');

    const { addToast } = useToast();

    useEffect(() => {
        const checkHealth = async () => {
            const isUp = await checkImageServiceHealth();
            setServiceStatus(isUp ? 'up' : 'down');
        };
        checkHealth();
    }, []);

    const handleUploadSuccess = (image: CloudinaryImage) => {
        setSessionImages((prev) => [image, ...prev]);
    };

    const handleDeleteClick = (publicId: string) => {
        setImageToDelete(publicId);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!imageToDelete) return;

        try {
            await deleteImage(imageToDelete);
            setSessionImages((prev) => prev.filter((img) => img.publicId !== imageToDelete));
            addToast({
                variant: 'success',
                title: 'Excluído',
                message: 'Imagem removida do Cloudinary com sucesso.',
            });
        } catch (error) {
            console.error('Delete error:', error);
            addToast({
                variant: 'error',
                title: 'Erro na exclusão',
                message: 'Não foi possível excluir a imagem. Verifique se o ID está correto.',
            });
        } finally {
            setIsConfirmOpen(false);
            setImageToDelete(null);
        }
    };

    const handleSearchById = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchId.trim()) return;

        setIsSearching(true);
        try {
            const details = await getImageDetails(searchId.trim());
            // Add to session images if not already there
            if (!sessionImages.find(img => img.publicId === details.publicId)) {
                setSessionImages(prev => [details, ...prev]);
            }
            addToast({
                variant: 'success',
                title: 'Encontrado',
                message: 'Detalhes da imagem carregados com sucesso.',
            });
            setSearchId('');
        } catch (error) {
            console.error('Search error:', error);
            addToast({
                variant: 'error',
                title: 'Não encontrado',
                message: 'Não foi possível encontrar uma imagem com esse Public ID.',
            });
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                        Gestão de Imagens
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        Status do Serviço:
                        {serviceStatus === 'checking' && <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>}
                        {serviceStatus === 'up' && <span className="flex items-center gap-1 text-green-500 font-medium"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>}
                        {serviceStatus === 'down' && <span className="flex items-center gap-1 text-red-500 font-medium"><span className="w-2 h-2 rounded-full bg-red-500"></span> Offline</span>}
                    </p>
                </div>

                <form onSubmit={handleSearchById} className="flex gap-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Buscar por Public ID..."
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className="md:w-64"
                    />
                    <Button variant="outline" type="submit" disabled={isSearching || !searchId.trim()}>
                        {isSearching ? 'Buscando...' : 'Importar'}
                    </Button>
                </form>
            </div>

            <div className="space-y-10">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Cloudinary Upload</h2>
                    </div>
                    <ImageUpload onUploadSuccess={handleUploadSuccess} />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-1 bg-blue-500 rounded-full"></div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Galeria da Sessão</h2>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            {sessionImages.length} itens
                        </span>
                    </div>
                    <ImageGallery images={sessionImages} onDelete={handleDeleteClick} />
                </section>
            </div>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Excluir Imagem"
                message="Tem certeza que deseja excluir esta imagem do Cloudinary? Esta ação é irreversível."
                confirmText="Excluir"
            />
        </div>
    );
}
