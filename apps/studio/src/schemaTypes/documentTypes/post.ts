import { Newspaper } from 'lucide-react';
import { defineField, defineType } from 'sanity';

import { FullSlugInput } from '../../customInputComponents/fullSlugInput';
import { isUniqueAcrossDocumentTypes } from '../../utils/isUnique';

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  icon: Newspaper,
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
        input: FullSlugInput,
      },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'person' },
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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publish time',
      type: 'datetime',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'ingress',
      title: 'Intro',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
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
      author: 'person.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
