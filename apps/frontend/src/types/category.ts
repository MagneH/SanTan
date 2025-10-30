import { z } from 'zod';
import { sanityImageZ, seoZ } from '@/types/sanitySchemas.ts';

// This is a Zod schema
// https://zod.dev/

// It will validate data at run time
// And generate Types during development
// Giving you both the flexibility of writing GROQ queries
// And the safety of Typescript
// without being limited to the shape of your Sanity Schema

export const categoryZ = z.object({
  _id: z.string(),
  _type: z.literal('category'),
  title: z.string().nullable(),
  fullSlug: z.string().nullable(),
  mainImage: sanityImageZ.nullable(),
  description: z.string().nullable(),
  seo: seoZ.nullable(),
  _createdAt: z.string(),
});

export type CategoryDocument = z.infer<typeof categoryZ>;

export const categoryStubZ = categoryZ.pick({
  title: true,
  fullSlug: true,
  description: true,
  mainImage: true,
  _createdAt: true,
});

export type CategoryStub = z.infer<typeof categoryStubZ>;

export const categoriesZ = z.array(categoryStubZ);
