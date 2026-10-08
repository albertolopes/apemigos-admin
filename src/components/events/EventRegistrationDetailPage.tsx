'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { useToast } from '@/hooks/useToast';
import { getEventoInscricao } from '@/lib/services/eventService';
import type { EventoInscricao } from '@/lib/types';
import { formatDateTime } from './eventUtils';
import { formatAnswerValue, getRegistrationDisplayData } from './registrationUtils';

export default function EventRegistrationDetailPage({ eventId, registrationId }: { eventId: number; registrationId: number }) {
  const [registration, setRegistration] = useState<EventoInscricao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setRegistration(await getEventoInscricao(eventId, registrationId));
      } catch (error) {
        console.error('Erro ao carregar inscrição:', error);
        addToast({ variant: 'error', title: 'Erro', message: 'Não foi possível carregar a inscrição.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistration();
  }, [eventId, registrationId, addToast]);

  if (isLoading) return <div className="p-6 text-gray-500 dark:text-gray-400">Carregando inscrição...</div>;

  const displayData = registration ? getRegistrationDisplayData(registration) : null;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Detalhe da inscrição</h1>
        <Button variant="outline" onClick={() => router.push(`/eventos/${eventId}/inscricoes`)}>Voltar</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Dados principais</h2>
          <dl className="space-y-3 text-sm">
            {[
              ['Nome', displayData?.nome],
              ['Email', displayData?.email],
              ['Telefone', displayData?.telefone],
              ['CPF', displayData?.cpf],
              ['Data da inscrição', formatDateTime(displayData?.dataInscricao)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-gray-500 dark:text-gray-400">{label}</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{value || 'N/A'}</dd>
              </div>
            ))}
            <div>
              <dt className="text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="mt-1"><Badge size="sm" color="info">{displayData?.status || 'N/A'}</Badge></dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Respostas do formulário</h2>
          <div className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {registration?.respostas?.length ? (
              registration.respostas.map((answer, index) => (
                <div key={`${answer.chave || answer.label}-${index}`} className="py-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{answer.label}</p>
                  <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">{formatAnswerValue(answer.valor)}</p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-gray-500 dark:text-gray-400">Nenhuma resposta encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
