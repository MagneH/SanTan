import { z } from 'zod';
import { sanityTypeLiterals } from '@santan/shared/types';
import { portableTextZ, sanityImageZ, seoZ } from '@/types/sanitySchemas.ts';

// This is a Zod schema
// https://zod.dev/

// It will validate data at run time
// And generate Types during development
// Giving you both the flexibility of writing GROQ queries
// And the safety of Typescript
// without being limited to the shape of your Sanity Schema

export const postZ = z.object({
  _id: z.string(),
  _type: z.literal(sanityTypeLiterals['post']),
  title: z.string().nullable(),
  fullSlug: z.string().nullable(),
  mainImage: sanityImageZ.nullable(),
  body: portableTextZ.nullable(),
  ingress: z.string().nullable(),
  seo: seoZ.nullable(),
  _createdAt: z.string(),
  publishedAt: z.string(),
  _updatedAt: z.string().nullable(),
  author: z.object({ name: z.string().nullable(), image: sanityImageZ.nullable() }).nullable(),
});

export type PostDocument = z.infer<typeof postZ>;

export const postStubZ = postZ.pick({
  title: true,
  fullSlug: true,
  ingress: true,
  mainImage: true,
  _createdAt: true,
  publishedAt: true,
  _id: true,
});

export type PostStub = z.infer<typeof postStubZ>;

export const postsZ = z.array(postStubZ);
