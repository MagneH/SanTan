import { TagIcon } from 'lucide-react';
import type { PreviewValue } from 'sanity';
import { defineField, defineType } from 'sanity';

import { FullSlugInput } from '../customInputComponents/fullSlugInput';
import { isUniqueAcrossDocumentTypes } from '../utils/isUnique';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,

  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
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
      title: 'Parent-kategori',
      description: 'Velg en overordnet kategori hvis aktuelt',
      type: 'reference',
      to: { type: 'category' },
    }),
    defineField({
      name: 'fullSlug',
      title: 'Full adresse',
      type: 'string',
      readOnly: true,
      description: 'Auto-generert ved publisering basert på slug og forelderkategori',
      components: {
        input: FullSlugInput, // Your custom input component
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Hovedbilde',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
    }),
    defineField({
      name: 'seo',
      title: 'SEO-innstillinger',
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
