'use client';

import React from 'react';
import { Modal } from './index';
import Button from '../button/Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger' | 'warning';
}

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'primary',
}: ConfirmationDialogProps) {
  
  let confirmButtonClass = '';
  
  // Usando !important para garantir que sobrescreva as cores padrão do botão
  if (variant === 'danger') {
    confirmButtonClass = '!bg-error-600 hover:!bg-error-700 !text-white !border-error-600';
  } else if (variant === 'warning') {
    // Ajustado para garantir contraste: fundo amarelo/laranja escuro com texto branco
    confirmButtonClass = '!bg-yellow-500 hover:!bg-yellow-600 !text-white !border-yellow-500';
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {message}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
        <Button 
          onClick={onConfirm} 
          className={`w-full sm:w-auto ${confirmButtonClass}`}
          // Usar 'primary' como base garante que a estrutura seja de um botão sólido (com background)
          // As classes acima irão apenas trocar a cor desse background.
          variant="primary"
        >
          {confirmText}
        </Button>
        <Button 
          onClick={onClose} 
          variant="outline" 
          className="w-full sm:w-auto"
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}
