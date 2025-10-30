import { z } from 'zod';

export const sanityImageSchemaZ = z
  .object({
    _type: z.literal('image'),
    asset: z
      .object({
        _ref: z.string(),
        _type: z.literal('reference'),
        _weak: z.boolean().optional(),
      })
      .optional(),
    crop: z
      .object({
        _type: z.literal('sanity.imageCrop').optional(),
        left: z.number().optional(),
        bottom: z.number().optional(),
        right: z.number().optional(),
        top: z.number().optional(),
      })
      .optional(),
    hotspot: z
      .object({
        _type: z.literal('sanity.imageHotspot').optional(),
        x: z.number().optional(),
        y: z.number().optional(),
        height: z.number().optional(),
        width: z.number().optional(),
      })
      .optional(),
    alt: z.string().optional(),
    // Add other custom fields you might have on your image type in Sanity
    caption: z.string().optional(),
    credits: z.string().optional(),
  })
  .nullable();

export type SanityImageType = z.infer<typeof sanityImageSchemaZ>;

// If you have an array of images, you can define it as:
export const SanityImageArraySchema = z.array(sanityImageSchemaZ);
