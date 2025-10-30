import { useLiveMode } from '@sanity/react-loader';

import { client } from '@/sanity/client';
import { STUDIO_BASEPATH } from '@/sanity/constants';
import { apiVersion } from '@/sanity/projectDetails.ts';

const liveClient = client.withConfig({
  apiVersion: apiVersion,
  perspective: 'drafts',
  stega: {
    enabled: true,
    studioUrl: STUDIO_BASEPATH,
  },
});

export function SanityLiveMode() {
  useLiveMode({ client: liveClient });
  return null;
}
