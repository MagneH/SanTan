import type { PropsWithChildren } from 'react';
import { title } from '@/components/Title/Title.css.ts';

export function Title({ children }: PropsWithChildren) {
  return <h1 className={title}>{children}</h1>;
}
