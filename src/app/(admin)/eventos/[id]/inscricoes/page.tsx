import EventRegistrationsPage from '@/components/events/EventRegistrationsPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventRegistrationsPage eventId={Number(id)} />;
}
