import { SearchCodeIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Search engine optimization (SEO)',
  type: 'object',
  icon: SearchCodeIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Meta description for search engines, social media sharing, etc.',
      type: 'string',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Add keywords for SEO, each as a separate string',
    }),
  ],
});
