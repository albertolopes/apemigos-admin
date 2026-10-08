'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { useToast } from '@/hooks/useToast';
import { getEvento, getEventoCampos, updateEventoCampos } from '@/lib/services/eventService';
import type { Evento, EventoCampo, EventoCampoTipo } from '@/lib/types';

const FIELD_TYPES: EventoCampoTipo[] = ['TEXT', 'TEXTAREA', 'EMAIL', 'PHONE', 'CPF', 'DATE', 'NUMBER', 'SELECT', 'RADIO', 'CHECKBOX'];
const optionTypes: EventoCampoTipo[] = ['SELECT', 'RADIO', 'CHECKBOX'];
const fieldTypeLabels: Record<EventoCampoTipo, string> = {
  TEXT: 'Texto curto',
  TEXTAREA: 'Texto longo',
  EMAIL: 'E-mail',
  PHONE: 'Telefone',
  CPF: 'CPF',
  DATE: 'Data',
  NUMBER: 'Número',
  SELECT: 'Lista de seleção',
  RADIO: 'Opção única',
  CHECKBOX: 'Múltipla escolha',
};
const booleanFieldLabels = {
  ativo: 'Ativo',
  obrigatorio: 'Obrigatório',
  unico: 'Valor único',
};
const helpTexts = {
  label: 'Nome exibido para o usuário no formulário público.',
  chave: 'Identificador técnico salvo com a resposta. Use letras minúsculas, números e underline.',
  tipo: 'Define como o campo será preenchido: texto, e-mail, CPF, seleção, múltipla escolha e outros.',
  placeholder: 'Texto de exemplo exibido dentro do campo antes do preenchimento.',
  textoAjuda: 'Orientação adicional exibida para ajudar o usuário a preencher corretamente.',
  ativo: 'Campo ativo aparece no portal público. Campo inativo fica oculto, sem apagar respostas antigas.',
  obrigatorio: 'Quando marcado, o usuário precisa preencher este campo para concluir a inscrição.',
  unico: 'Impede nova inscrição com o mesmo valor neste evento. Útil para CPF, e-mail ou telefone.',
  optionLabel: 'Texto exibido para o usuário em uma opção de seleção.',
  optionValue: 'Valor técnico salvo quando esta opção for escolhida.',
};

function HelpButton({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        aria-label="Ajuda"
      >
        ?
      </button>
      {isOpen && (
        <span className="absolute left-1/2 top-7 z-20 w-64 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-xs font-normal leading-5 text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          {text}
        </span>
      )}
    </span>
  );
}

function FieldLabel({ children, help }: { children: React.ReactNode; help: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <Label className="mb-0">{children}</Label>
      <HelpButton text={help} />
    </div>
  );
}

const newField = (ordem: number): EventoCampo => ({
  label: '',
  chave: '',
  tipo: 'TEXT',
  obrigatorio: false,
  unico: false,
  ordem,
  placeholder: '',
  textoAjuda: '',
  ativo: true,
  opcoes: [],
});

const slugKey = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

export default function EventFormBuilderPage({ eventId }: { eventId: number }) {
  const [event, setEvent] = useState<Evento | null>(null);
  const [fields, setFields] = useState<EventoCampo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const orderedFields = useMemo(() => [...fields].sort((a, b) => a.ordem - b.ordem), [fields]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventResponse, fieldsResponse] = await Promise.all([getEvento(eventId), getEventoCampos(eventId)]);
        setEvent(eventResponse);
        setFields(fieldsResponse.map((field, index) => ({ ...field, ordem: field.ordem ?? index, opcoes: field.opcoes || [] })));
      } catch (error) {
        console.error('Erro ao carregar formulário:', error);
        addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível carregar o formulário.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId, addToast]);

  const replaceField = (index: number, patch: Partial<EventoCampo>) => {
    setFields((current) => current.map((field, itemIndex) => {
      if (itemIndex !== index) return field;
      const next = { ...field, ...patch };
      if (patch.label !== undefined && !field.id) next.chave = field.chave || slugKey(patch.label);
      if (patch.tipo && !optionTypes.includes(patch.tipo)) next.opcoes = [];
      return next;
    }));
  };

  const moveField = (index: number, direction: -1 | 1) => {
    setFields((current) => {
      const copy = [...current];
      const target = index + direction;
      if (target < 0 || target >= copy.length) return current;
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy.map((field, ordem) => ({ ...field, ordem }));
    });
  };

  const addOption = (fieldIndex: number) => {
    setFields((current) => current.map((field, index) => index === fieldIndex ? {
      ...field,
      opcoes: [...field.opcoes, { label: '', valor: '', ordem: field.opcoes.length }],
    } : field));
  };

  const updateOption = (fieldIndex: number, optionIndex: number, key: 'label' | 'valor', value: string) => {
    setFields((current) => current.map((field, index) => index === fieldIndex ? {
      ...field,
      opcoes: field.opcoes.map((option, currentOptionIndex) => currentOptionIndex === optionIndex ? {
        ...option,
        [key]: value,
        valor: key === 'label' && !option.valor ? slugKey(value) : option.valor,
      } : option),
    } : field));
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    setFields((current) => current.map((field, index) => index === fieldIndex ? {
      ...field,
      opcoes: field.opcoes.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex).map((option, ordem) => ({ ...option, ordem })),
    } : field));
  };

  const save = async () => {
    const invalid = fields.some((field) => !field.label.trim() || !field.chave.trim());
    if (invalid) {
      addToast({ variant: 'error', title: 'Erro', message: 'Todos os campos precisam de label e chave.' });
      return;
    }
    setIsSaving(true);
    try {
      const payload = fields.map((field, ordem) => ({ ...field, ordem }));
      const response = await updateEventoCampos(eventId, payload);
      setFields(response);
      addToast({ variant: 'success', title: 'Sucesso', message: 'Formulário salvo com sucesso.' });
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível salvar o formulário.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-6 text-gray-500 dark:text-gray-400">Carregando formulário...</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Formulário do evento</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{event?.titulo}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/eventos')}>Voltar</Button>
          <Button onClick={() => setFields((current) => [...current, newField(current.length)])}>Adicionar campo</Button>
          <Button onClick={save} disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {orderedFields.map((field, index) => (
          <div key={field.id || index} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Campo nº {index + 1}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => moveField(index, -1)} disabled={index === 0}>Subir</Button>
                <Button size="sm" variant="outline" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}>Descer</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <FieldLabel help={helpTexts.label}>Nome do campo</FieldLabel>
                <Input value={field.label} onChange={(event) => replaceField(index, { label: event.target.value })} />
              </div>
              <div>
                <FieldLabel help={helpTexts.chave}>Identificador</FieldLabel>
                <Input value={field.chave} onChange={(event) => replaceField(index, { chave: slugKey(event.target.value) })} />
              </div>
              <div>
                <FieldLabel help={helpTexts.tipo}>Tipo de campo</FieldLabel>
                <select value={field.tipo} onChange={(event) => replaceField(index, { tipo: event.target.value as EventoCampoTipo })} className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90">
                  {FIELD_TYPES.map((type) => <option key={type} value={type}>{fieldTypeLabels[type]}</option>)}
                </select>
              </div>
              <div>
                <FieldLabel help={helpTexts.placeholder}>Texto de exemplo</FieldLabel>
                <Input value={field.placeholder || ''} onChange={(event) => replaceField(index, { placeholder: event.target.value })} />
              </div>
              <div>
                <FieldLabel help={helpTexts.textoAjuda}>Texto de ajuda</FieldLabel>
                <Input value={field.textoAjuda || ''} onChange={(event) => replaceField(index, { textoAjuda: event.target.value })} />
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-7 text-sm text-gray-700 dark:text-gray-300">
                {(['ativo', 'obrigatorio', 'unico'] as const).map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input type="checkbox" checked={Boolean(field[key])} onChange={(event) => replaceField(index, { [key]: event.target.checked })} />
                    {booleanFieldLabels[key]}
                    <HelpButton text={helpTexts[key]} />
                  </label>
                ))}
              </div>
            </div>

            {optionTypes.includes(field.tipo) && (
              <div className="mt-4 border-t border-gray-100 pt-4 dark:border-white/[0.05]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Opções</span>
                  <Button size="sm" variant="outline" onClick={() => addOption(index)}>Adicionar opção</Button>
                </div>
                <div className="space-y-2">
                  {field.opcoes.map((option, optionIndex) => (
                    <div key={optionIndex} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                      <div>
                        <FieldLabel help={helpTexts.optionLabel}>Nome da opção</FieldLabel>
                        <Input value={option.label} placeholder="Ex.: Sim" onChange={(event) => updateOption(index, optionIndex, 'label', event.target.value)} />
                      </div>
                      <div>
                        <FieldLabel help={helpTexts.optionValue}>Valor da opção</FieldLabel>
                        <Input value={option.valor} placeholder="Ex.: sim" onChange={(event) => updateOption(index, optionIndex, 'valor', slugKey(event.target.value))} />
                      </div>
                      <Button size="sm" variant="outline" onClick={() => removeOption(index, optionIndex)}>Remover</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
