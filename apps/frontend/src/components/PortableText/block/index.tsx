import type { ReactNode } from 'react';

// Example block serializer for Portable Text
export const block = {
  h1: ({ children }: { children?: ReactNode }) => (children ? <h1>{children}</h1> : null),
};
