import EventFormPage from '@/components/events/EventFormPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventFormPage eventId={Number(id)} />;
}
