'use client';

import React, { useEffect, useState } from 'react';
import {
    getProjects,
    deleteProject,
    createProject,
    updateProject,
} from '@/lib/services/projectService';
import { Projeto, Page } from '@/lib/types';
import ProjectTable from '@/components/projects/ProjectTable';
import ProjectForm from '@/components/projects/ProjectForm';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import ConfirmDialog from '@/components/ui/modal/ConfirmDialog';
import Input from '@/components/form/input/InputField';
import { useToast } from '@/hooks/useToast';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Projeto[]>([]);
    const [page, setPage] = useState<Page<Projeto> | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState<Partial<Projeto> | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [projectToDeleteId, setProjectToDeleteId] = useState<number | null>(null);

    const { addToast } = useToast();

    const fetchProjects = async (pageNumber = 0) => {
        try {
            const response = await getProjects(pageNumber, 10, searchTerm);
            setPage(response);
            setProjects(response.content);
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            addToast({
                variant: 'error',
                title: 'Erro!',
                message: 'Não foi possível carregar a lista de projetos.'
            });
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProjects(0);
    };

    const handleAddClick = () => {
        setSelectedProject(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (item: Projeto) => {
        setSelectedProject(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setProjectToDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (projectToDeleteId === null) return;

        try {
            await deleteProject(projectToDeleteId);
            addToast({
                variant: 'success',
                title: 'Excluído',
                message: 'Projeto excluído com sucesso.'
            });
            fetchProjects();
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
            addToast({
                variant: 'error',
                title: 'Erro de Exclusão',
                message: 'Não foi possível excluir o projeto.'
            });
        } finally {
            setIsConfirmOpen(false);
            setProjectToDeleteId(null);
        }
    };

    const handleSave = async (projectData: Partial<Projeto>) => {
        setIsSaving(true);
        try {
            if (projectData.id) {
                await updateProject(projectData.id, projectData);
            } else {
                await createProject(projectData);
            }
            await fetchProjects();
            setIsModalOpen(false);
            addToast({
                variant: 'success',
                title: 'Sucesso!',
                message: projectData.id ? 'Projeto atualizado com sucesso.' : 'Projeto criado com sucesso.'
            });
        } catch (error) {
            console.error('Erro ao salvar projeto:', error);
            addToast({
                variant: 'error',
                title: 'Erro ao Salvar',
                message: 'Ocorreu um erro ao tentar salvar o projeto.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">
                    Gerenciamento de Projetos
                </h1>

                <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
                    <form onSubmit={handleSearch} className="flex items-end gap-2 w-full sm:w-auto">
                        <div className="w-full sm:w-64">
                            <label
                                htmlFor="search"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Buscar projeto
                            </label>
                            <Input
                                id="search"
                                type="text"
                                placeholder="Ex: Rifa"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                    <Button variant="primary" onClick={handleAddClick} className="mb-[1px]">
                        Adicionar Projeto
                    </Button>
                </div>
            </div>

            <ProjectTable
                projects={projects}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {page && (
                <div className="flex items-center justify-between mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Total de projetos: <span className="font-medium text-gray-900 dark:text-white">{page.totalElements}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                            Página {page.number + 1} de {page.totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProjects(page.number - 1)}
                            disabled={page.number === 0}
                        >
                            Anterior
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchProjects(page.number + 1)}
                            disabled={page.number >= page.totalPages - 1}
                        >
                            Próxima
                        </Button>
                    </div>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-4xl">
                <ProjectForm
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                    initialData={selectedProject}
                    isSaving={isSaving}
                />
            </Modal>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja excluir este projeto? Esta ação não pode ser desfeita."
                confirmText="Excluir"
            />
        </div>
    );
}
