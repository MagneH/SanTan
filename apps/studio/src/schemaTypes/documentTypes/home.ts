import { Home } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const home = defineType({
  name: 'home',
  title: 'Homepage',
  type: 'document',
  icon: Home,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The title used on the front page',
      type: 'string',
    }),
    defineField({
      name: 'subTitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'A short description displayed below the subtitle on the front page. (Optional)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subTitle: 'subTitle',
      description: 'description',
    },
  },
});
