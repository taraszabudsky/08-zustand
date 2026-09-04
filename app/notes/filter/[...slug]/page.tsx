import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const { slug } = await params;
  const tagFromUrl = slug[0]; // "all" | "Work" | "Todo" ...
  const tag = tagFromUrl === 'all' ? undefined : tagFromUrl;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '', tag: tagFromUrl }],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagFromUrl} />
    </HydrationBoundary>
  );
}