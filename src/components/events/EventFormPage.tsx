'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import TextArea from '@/components/form/input/TextArea';
import { useToast } from '@/hooks/useToast';
import { createEvento, getEvento, updateEvento } from '@/lib/services/eventService';
import type { Evento, EventoStatus } from '@/lib/types';
import { EVENTO_STATUS, fromDateTimeLocal, makeSlug, slugRegex, toDateTimeLocal } from './eventUtils';

const emptyForm: Partial<Evento> = {
  titulo: '',
  slug: '',
  descricao: '',
  imagem: '',
  local: '',
  dataInicio: null,
  dataFim: null,
  inicioInscricoes: null,
  fimInscricoes: null,
  limiteInscricoes: null,
  status: 'RASCUNHO',
};

export default function EventFormPage({ eventId }: { eventId?: number }) {
  const [form, setForm] = useState<Partial<Evento>>(emptyForm);
  const [isLoading, setIsLoading] = useState(Boolean(eventId));
  const [isSaving, setIsSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(eventId));
  const [slugError, setSlugError] = useState('');
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    if (!eventId) return;
    const fetchEvent = async () => {
      try {
        const response = await getEvento(eventId);
        setForm(response);
      } catch (error) {
        console.error('Erro ao carregar evento:', error);
        addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível carregar o evento.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, addToast]);

  const updateField = (field: keyof Evento, value: string | number | null) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateTitle = (value: string) => {
    setForm((current) => ({
      ...current,
      titulo: value,
      slug: slugTouched ? current.slug : makeSlug(value),
    }));
  };

  const updateSlug = (value: string) => {
    setSlugTouched(true);
    setSlugError('');
    updateField('slug', value);
  };

  const getErrorMessage = (error: unknown) => {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const response = (error as { response?: { data?: unknown } }).response;
      const data = response?.data;
      if (typeof data === 'string') return data;
      if (typeof data === 'object' && data !== null) {
        const objectData = data as Record<string, unknown>;
        return String(objectData.message || objectData.error || '');
      }
    }
    return '';
  };

  const copyPublicLink = async () => {
    if (!form.slug) return;
    const path = `/eventos/${form.slug}`;
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    try {
      await navigator.clipboard.writeText(url);
      addToast({ variant: 'success', title: 'Sucesso', message: 'Link público copiado.' });
    } catch (error) {
      console.error('Erro ao copiar link público:', error);
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível copiar o link público.' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.titulo?.trim()) {
      addToast({ variant: 'error', title: 'Erro', message: 'Informe o título do evento.' });
      return;
    }
    const slug = form.slug?.trim() || '';
    if (slug && !slugRegex.test(slug)) {
      setSlugError('Use apenas letras minúsculas, números e hífen. Não use espaços, underline ou hífen no início/fim.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        slug: slug || null,
        limiteInscricoes: form.limiteInscricoes === undefined || form.limiteInscricoes === null
          ? null
          : Number(form.limiteInscricoes),
      };
      if (eventId) {
        await updateEvento(eventId, payload);
      } else {
        await createEvento(payload);
      }
      addToast({ variant: 'success', title: 'Sucesso', message: `Evento ${eventId ? 'atualizado' : 'criado'} com sucesso.` });
      router.push('/eventos');
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      const errorMessage = getErrorMessage(error);
      if (errorMessage.toLowerCase().includes('slug')) {
        setSlugError('Já existe um evento com este slug.');
      }
      addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível salvar o evento.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-500 dark:text-gray-400">Carregando evento...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {eventId ? 'Editar evento' : 'Novo evento'}
        </h1>
        <Button variant="outline" onClick={() => router.push('/eventos')}>Voltar</Button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Título *</Label>
            <Input value={form.titulo || ''} onChange={(event) => updateTitle(event.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <Label>Slug</Label>
            <Input
              value={form.slug || ''}
              placeholder="caminhada-beneficente-2026"
              onChange={(event) => updateSlug(event.target.value)}
              error={Boolean(slugError)}
              hint={slugError || 'Usado na URL pública. Se ficar vazio, o backend gera automaticamente.'}
            />
            {form.slug && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span>URL pública: /eventos/{form.slug}</span>
                <button
                  type="button"
                  onClick={copyPublicLink}
                  className="rounded-md border border-gray-300 px-2 py-1 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/[0.03]"
                >
                  Copiar link público
                </button>
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <Label>Descrição</Label>
            <TextArea value={form.descricao || ''} rows={5} onChange={(value) => updateField('descricao', value)} />
          </div>
          <div>
            <Label>Imagem</Label>
            <Input value={form.imagem || ''} placeholder="URL da imagem" onChange={(event) => updateField('imagem', event.target.value)} />
          </div>
          <div>
            <Label>Local</Label>
            <Input value={form.local || ''} onChange={(event) => updateField('local', event.target.value)} />
          </div>
          <div>
            <Label>Data início</Label>
            <Input type="datetime-local" value={toDateTimeLocal(form.dataInicio)} onChange={(event) => updateField('dataInicio', fromDateTimeLocal(event.target.value))} />
          </div>
          <div>
            <Label>Data fim</Label>
            <Input type="datetime-local" value={toDateTimeLocal(form.dataFim)} onChange={(event) => updateField('dataFim', fromDateTimeLocal(event.target.value))} />
          </div>
          <div>
            <Label>Início das inscrições</Label>
            <Input type="datetime-local" value={toDateTimeLocal(form.inicioInscricoes)} onChange={(event) => updateField('inicioInscricoes', fromDateTimeLocal(event.target.value))} />
          </div>
          <div>
            <Label>Fim das inscrições</Label>
            <Input type="datetime-local" value={toDateTimeLocal(form.fimInscricoes)} onChange={(event) => updateField('fimInscricoes', fromDateTimeLocal(event.target.value))} />
          </div>
          <div>
            <Label>Limite de inscrições</Label>
            <Input type="number" min="0" value={form.limiteInscricoes ?? ''} onChange={(event) => updateField('limiteInscricoes', event.target.value ? Number(event.target.value) : null)} />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={form.status || 'RASCUNHO'}
              onChange={(event) => updateField('status', event.target.value as EventoStatus)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              {EVENTO_STATUS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push('/eventos')}>Cancelar</Button>
          <Button type="submit" disabled={isSaving}>{isSaving ? 'Salvando...' : 'Salvar evento'}</Button>
        </div>
      </form>
    </div>
  );
}
