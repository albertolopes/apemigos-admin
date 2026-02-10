import api from './api';
import type { CloudinaryImage, ImageUploadResponse } from '../types';

const mapResponseToImage = (response: ImageUploadResponse): CloudinaryImage => ({
    publicId: response.public_id,
    url: response.url,
    // format, width, etc are optional in the new response structure
});

export const uploadImage = async (file: File): Promise<ImageUploadResponse & { mappedImage: CloudinaryImage }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    const data = response.data as ImageUploadResponse;
    return {
        ...data,
        mappedImage: mapResponseToImage(data)
    };
};

export const uploadImageFromUrl = async (url: string): Promise<ImageUploadResponse & { mappedImage: CloudinaryImage }> => {
    const response = await api.post('/images/upload-from-url', { url });
    const data = response.data as ImageUploadResponse;
    return {
        ...data,
        mappedImage: mapResponseToImage(data)
    };
};

export const deleteImage = async (publicId: string): Promise<void> => {
    await api.delete('/images/delete', {
        params: { publicId },
    });
};

export const getImageDetails = async (publicId: string): Promise<CloudinaryImage> => {
    const response = await api.get(`/images/details/${publicId}`);
    return response.data;
};

export const getTransformUrl = async (publicId: string): Promise<string> => {
    const response = await api.get(`/images/transform/${publicId}`);
    return response.data;
};

export const checkImageServiceHealth = async (): Promise<boolean> => {
    try {
        const response = await api.get('/images/health');
        return response.status === 200;
    } catch (error) {
        return false;
    }
};
