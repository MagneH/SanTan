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
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      description: 'En kort beskrivelse som vises under undertittel på forsiden. (Valgfri)',
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
