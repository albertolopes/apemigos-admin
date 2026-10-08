import EventRegistrationDetailPage from '@/components/events/EventRegistrationDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; inscricaoId: string }>;
}) {
  const { id, inscricaoId } = await params;
  return <EventRegistrationDetailPage eventId={Number(id)} registrationId={Number(inscricaoId)} />;
}
