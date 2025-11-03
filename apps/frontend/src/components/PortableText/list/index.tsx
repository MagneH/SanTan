import type { ReactNode } from 'react';

export const list = ({ type, children }: { type?: 'number' | 'bullet'; children?: ReactNode }) => {
  if (type === 'number') return <ol>{children}</ol>;
  return <ul>{children}</ul>; // default bullet
};

export const listItem = ({ children }: { children?: ReactNode; value?: any }) => {
  return <li>{children}</li>;
};
