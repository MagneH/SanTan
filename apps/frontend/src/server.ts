// src/server.ts
import { createStart } from '@tanstack/react-start';
import { getRouter } from './router';

console.log('[server.ts] init TanStack Start SSR');

export default createStart({ getRouter });
