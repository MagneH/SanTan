import { z } from 'zod';

export const homeZ = z.object({
  title: z.string().nullable(),
  subTitle: z.string().nullable(),
});

export type HomeDocument = z.infer<typeof homeZ>;
