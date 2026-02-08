import { TagIcon } from 'lucide-react';
import type { PreviewValue } from 'sanity';
import { defineField, defineType } from 'sanity';

import { FullSlugInput } from '../../customInputComponents/fullSlugInput';
import { isUniqueAcrossDocumentTypes } from '../../utils/isUnique';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: isUniqueAcrossDocumentTypes,
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'parent',
      title: 'Parent category',
      description: 'Select a parent category if applicable',
      type: 'reference',
      to: { type: 'category' },
    }),
    defineField({
      name: 'fullSlug',
      title: 'Full path',
      type: 'string',
      readOnly: true,
      description: 'Automatically generated on publish based on slug and parent category',
      components: {
        input: FullSlugInput, // Your custom input component
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'seo',
      title: 'SEO settings',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      fullSlug: 'fullSlug',
    },
    prepare(selection): PreviewValue {
      const { title, fullSlug } = selection;
      return { title, subtitle: fullSlug };
    },
  },
});
