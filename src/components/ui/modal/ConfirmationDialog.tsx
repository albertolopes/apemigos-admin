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
  isLoading?: boolean; // Nova prop
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
  isLoading = false, // Default false
}: ConfirmationDialogProps) {
  
  let confirmButtonClass = '';
  
  if (variant === 'danger') {
    confirmButtonClass = '!bg-error-600 hover:!bg-error-700 !text-white !border-error-600';
  } else if (variant === 'warning') {
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
          variant="primary"
          disabled={isLoading} // Desabilita durante o loading
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </span>
          ) : (
            confirmText
          )}
        </Button>
        <Button 
          onClick={onClose} 
          variant="outline" 
          className="w-full sm:w-auto"
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      </div>
    </Modal>
  );
}
