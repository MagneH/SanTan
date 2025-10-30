import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/pages/Home/Home.tsx';
import { homeLoader } from '@/loaders/home.ts';
import { homeMeta } from '@/pages/Home/meta.ts';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner.tsx';

// Index Route
export const Route = createFileRoute('/')({
  component: HomePage,
  loader: homeLoader,
  head: ({ loaderData, match }) => homeMeta(loaderData?.initial?.data.homeData, match.fullPath),
  pendingComponent: LoadingSpinner,
});
