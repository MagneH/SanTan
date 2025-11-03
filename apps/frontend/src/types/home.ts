import { z } from 'zod';
import { portableTextZ } from '@/types/sanitySchemas.ts';

export const homeZ = z.object({
  title: z.string().nullable(),
  subTitle: z.string().nullable(),
  description: portableTextZ.nullable(),
});

export type HomeDocument = z.infer<typeof homeZ>;
