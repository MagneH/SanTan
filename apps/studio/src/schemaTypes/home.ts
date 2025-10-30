import { Home } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const home = defineType({
  name: 'home',
  title: 'Hjemmeside',
  type: 'document',
  icon: Home,
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      description: 'Tittelen som brukes på førstesiden',
      type: 'string',
    }),
    defineField({
      name: 'subTitle',
      title: 'Undertittel',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subTitle: 'subTitle',
    },
  },
});
