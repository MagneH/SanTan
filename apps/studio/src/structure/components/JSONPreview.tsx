import type { SanityDocument } from 'sanity';

// Stringifying a JSON representation of the displayed data
export const JSONPreview = ({ document }: { document: SanityDocument }) => (
  <>
    <pre>{JSON.stringify(document.displayed, null, 2)}</pre>
  </>
);
