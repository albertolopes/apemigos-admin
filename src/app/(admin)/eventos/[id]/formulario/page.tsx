import EventFormBuilderPage from '@/components/events/EventFormBuilderPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventFormBuilderPage eventId={Number(id)} />;
}
