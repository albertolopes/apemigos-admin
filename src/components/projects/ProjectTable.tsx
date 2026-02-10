'use client';

import React from 'react';
import Image from 'next/image';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../ui/table/index';
import Button from '../ui/button/Button';
import { Projeto } from '@/lib/types';

interface ProjectTableProps {
    projects: Projeto[];
    onEdit: (project: Projeto) => void;
    onDelete: (id: number) => void;
}

export default function ProjectTable({ projects, onEdit, onDelete }: ProjectTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-full">
                    <Table>
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Capa
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Título
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Resumo
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                                    Data de Criação
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-end text-theme-xs dark:text-gray-400">
                                    Ações
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {projects.length > 0 ? (
                                projects.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="px-5 py-4 text-start">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                                                {item.cover ? (
                                                    <img
                                                        src={item.cover}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] text-gray-400">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 font-medium">
                                            {item.title}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-xs truncate">
                                            {item.shortDescription}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-end text-theme-sm dark:text-gray-400">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => onEdit(item)}>
                                                    Editar
                                                </Button>
                                                <Button size="sm" variant="outline" className="text-error-500 hover:bg-error-50" onClick={() => onDelete(item.id)}>
                                                    Excluir
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                                        Nenhum projeto encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
