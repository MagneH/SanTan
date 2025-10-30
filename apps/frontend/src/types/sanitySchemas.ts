import { z } from 'zod';

// Sanity Image Schema
export const sanityImageAssetZ = z.object({
  _ref: z.string(),
  _type: z.literal('reference'),
  _weak: z.boolean().optional(),
});

export const sanityImageHotspotZ = z.object({
  _type: z.literal('sanity.imageHotspot'),
  x: z.number().optional(),
  y: z.number().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
});

export const sanityImageCropZ = z.object({
  _type: z.literal('sanity.imageCrop'),
  top: z.number().optional(),
  bottom: z.number().optional(),
  left: z.number().optional(),
  right: z.number().optional(),
});

export const sanityImageZ = z.object({
  asset: sanityImageAssetZ.optional(),
  hotspot: sanityImageHotspotZ.optional(),
  crop: sanityImageCropZ.optional(),
  alt: z.string().optional(),
  _type: z.literal('image'),
});

export type SanityImage = z.infer<typeof sanityImageZ>;

// Portable Text Block Schema
export const spanZ = z.object({
  _type: z.literal('span'),
  _key: z.string(),
  text: z.string().optional(),
  marks: z.array(z.string()).optional(),
});

export const linkMarkDefZ = z.object({
  _type: z.literal('link'),
  _key: z.string(),
  href: z.string().optional(),
});

export const phoneNumberLinkMarkDefZ = z.object({
  _type: z.literal('phoneNumberLink'),
  _key: z.string(),
  phoneNumber: z.string().optional(),
});

export const markDefZ = z.union([linkMarkDefZ, phoneNumberLinkMarkDefZ]);

export const blockZ = z.object({
  _type: z.literal('block'),
  _key: z.string(),
  style: z.enum(['normal', 'h1', 'h2', 'h3', 'h4', 'blockquote']).optional(),
  listItem: z.enum(['bullet', 'number']).optional(),
  level: z.number().optional(),
  children: z.array(spanZ).optional(),
  markDefs: z.array(markDefZ).optional(),
});

export const imageBlockZ = z.object({
  _type: z.literal('image'),
  _key: z.string(),
  asset: sanityImageAssetZ.optional(),
  hotspot: sanityImageHotspotZ.optional(),
  crop: sanityImageCropZ.optional(),
});

export const accordionContentBlockZ = z.object({
  _type: z.literal('block'),
  _key: z.string(),
  style: z.enum(['normal', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']).optional(),
  listItem: z.enum(['bullet', 'number']).optional(),
  level: z.number().optional(),
  children: z.array(spanZ).optional(),
  markDefs: z.array(linkMarkDefZ).optional(),
});

export const accordionZ = z.object({
  _type: z.literal('accordion'),
  _key: z.string(),
  title: z.string().optional(),
  content: z.array(accordionContentBlockZ).optional(),
});

export const portableTextBlockZ = z.union([blockZ, imageBlockZ, accordionZ]);

export const portableTextZ = z.array(portableTextBlockZ);

export type PortableTextBlock = z.infer<typeof portableTextBlockZ>;
export type PortableText = z.infer<typeof portableTextZ>;

// SEO Schema
export const seoZ = z.object({
  _type: z.literal('seo'),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export type Seo = z.infer<typeof seoZ>;
