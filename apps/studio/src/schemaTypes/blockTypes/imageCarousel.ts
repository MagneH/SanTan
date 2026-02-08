import { ImagesIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const imageCarousel = defineType({
  name: 'imageCarousel',
  type: 'object',
  title: 'Image carousel',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      description: 'Add images for the carousel',
      type: 'array',
      of: [{ type: 'enrichedImage' }],
      validation: (Rule) => Rule.min(1).error('The carousel must contain at least one image.'),
    }),
    defineField({
      name: 'numberOfImagesToShow',
      title: 'Number of images to display at once',
      description: 'Choose how many images should be displayed at once in the carousel',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(5).error('The carousel must display between one and five images.'),
    }),
  ],
});
