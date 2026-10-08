import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; inscricaoId: string }>;
}) {
  const { id, inscricaoId } = await params;
  redirect(`/eventos/${id}/inscricoes/${inscricaoId}`);
}
