'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Label from '../form/Label';
import Select from '../form/Select'; // Assumindo que existe, ou usarei um select nativo estilizado
import { AssociadoResponseDTO, StatusCarteirinha } from '@/lib/types';

interface AssociadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  associado: AssociadoResponseDTO | null;
  onStatusChange: (id: number, status: StatusCarteirinha) => void;
}

const statusOptions: { value: StatusCarteirinha; label: string }[] = [
  { value: 'SOLICITADA', label: 'Solicitada' },
  { value: 'EM_ANALISE', label: 'Em Análise' },
  { value: 'PENDENTE_DOC', label: 'Pendente Documentação' },
  { value: 'APROVADA', label: 'Aprovada' },
  { value: 'EM_PRODUCAO', label: 'Em Produção' },
  { value: 'EXPEDIDA', label: 'Expedida' },
  { value: 'ENVIADA', label: 'Enviada' },
  { value: 'ENTREGUE', label: 'Entregue' },
  { value: 'CANCELADA', label: 'Cancelada' },
  { value: 'VENCIDA', label: 'Vencida' },
];

export default function AssociadoModal({ isOpen, onClose, associado, onStatusChange }: AssociadoModalProps) {
  const [newStatus, setNewStatus] = useState<StatusCarteirinha | ''>('');

  if (!associado) return null;

  const handleSaveStatus = () => {
    if (newStatus && newStatus !== associado.statusCarteirinha) {
      onStatusChange(associado.id, newStatus as StatusCarteirinha);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6">
      <div className="flex justify-between items-start mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Detalhes do Associado
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Solicitado em: {new Date(associado.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400">✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Dados Pessoais</h3>
          <InfoRow label="Nome Completo" value={`${associado.nome} ${associado.sobrenome}`} />
          <InfoRow label="CPF" value={associado.cpf} />
          <InfoRow label="RG" value={associado.rg} />
          <InfoRow label="Data de Nascimento" value={new Date(associado.dataNascimento).toLocaleDateString()} />
          <InfoRow label="Email" value={associado.email} />
          <InfoRow label="Telefone" value={associado.telefoneContato} />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Endereço</h3>
          <InfoRow label="Logradouro" value={`${associado.logradouro}, ${associado.complemento || ''}`} />
          <InfoRow label="Bairro" value={associado.bairro} />
          <InfoRow label="Cidade/UF" value={`${associado.cidade}/${associado.estado}`} />
          <InfoRow label="CEP" value={associado.cep} />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Saúde / Emergência</h3>
          <InfoRow label="Médico Responsável" value={associado.medicoResponsavel} />
          <InfoRow label="Telefone Médico" value={associado.telefoneMedico} />
          <InfoRow label="Contato Emergência" value={associado.nomeContatoEmergencia} />
          <InfoRow label="Tel. Emergência" value={associado.telefoneEmergencia} />
          <InfoRow label="Convênio" value={associado.possuiConvenio ? associado.convenioNome : 'Não possui'} />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">Status da Carteirinha</h3>
          <div>
            <Label>Status Atual</Label>
            <div className="font-medium text-gray-800 dark:text-white mb-2">
              {statusOptions.find(o => o.value === associado.statusCarteirinha)?.label || associado.statusCarteirinha}
            </div>
            
            <Label>Alterar Status</Label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newStatus || associado.statusCarteirinha}
              onChange={(e) => setNewStatus(e.target.value as StatusCarteirinha)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {associado.observacoes && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">Observações</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{associado.observacoes}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSaveStatus}
          disabled={!newStatus || newStatus === associado.statusCarteirinha}
        >
          Salvar Alteração
        </Button>
      </div>
    </Modal>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="block text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="block text-sm font-medium text-gray-800 dark:text-white">{value || '-'}</span>
  </div>
);
