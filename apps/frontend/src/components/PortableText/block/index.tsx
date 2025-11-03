import type { ReactNode } from 'react';

// Example block serializer for Portable Text
export const block = {
  normal: ({ children }: { children?: ReactNode }) => (children ? <p>{children}</p> : null),
  h1: ({ children }: { children?: ReactNode }) => (children ? <h1>{children}</h1> : null),
  h2: ({ children }: { children?: ReactNode }) => (children ? <h2>{children}</h2> : null),
  h3: ({ children }: { children?: ReactNode }) => (children ? <h3>{children}</h3> : null),
  h4: ({ children }: { children?: ReactNode }) => (children ? <h4>{children}</h4> : null),
  blockquote: ({ children }: { children?: ReactNode }) => (children ? <blockquote>{children}</blockquote> : null),
};
