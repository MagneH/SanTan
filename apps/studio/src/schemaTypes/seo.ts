import { SearchCodeIcon } from 'lucide-react';
import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'Søkemotoroptimalisering (SEO)',
  type: 'object',
  icon: SearchCodeIcon,
  fields: [
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      description: 'Meta-beskrivelse for SEO',
      type: 'string',
    }),
    defineField({
      name: 'keywords',
      title: 'Nøkkelord',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Legg til nøkkelord for SEO, separert som individuelle strenger',
    }),
  ],
});
