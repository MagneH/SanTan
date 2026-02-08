import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const enrichedImage = defineType({
  name: 'enrichedImage',
  title: 'Enriched image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      description: 'The image itself',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (R) => R.required().error('An image must be selected.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'The caption is usually displayed below the image',
      validation: (R) => R.required().error('Caption is a required field.'),
    }),
    defineField({
      name: 'altText',
      title: 'Alt text',
      type: 'string',
      description: 'A short description of the image for accessibility (alt text)',
      validation: (R) => R.required().error('Alt text is a required field.'),
    }),
    defineField({
      name: 'credits',
      title: 'Photographer',
      type: 'reference',
      to: [{ type: 'person' }],
      description: 'Select the photographer who took the image',
      validation: (R) => R.required().error('Photographer is a required field.'),
    }),
  ],
});
