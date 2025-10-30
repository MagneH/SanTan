import { Newspaper } from 'lucide-react';
import { defineField, defineType } from 'sanity';

import { FullSlugInput } from '../customInputComponents/fullSlugInput';
import { isUniqueAcrossDocumentTypes } from '../utils/isUnique';

export const post = defineType({
  name: 'post',
  title: 'Bloggpost',
  type: 'document',
  icon: Newspaper,
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
        input: FullSlugInput,
      },
    }),
    defineField({
      name: 'author',
      title: 'Forfatter',
      type: 'reference',
      to: { type: 'author' },
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
      name: 'categories',
      title: 'Kategorier',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tid for publisering',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'ingress',
      title: 'Ingress',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
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
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
