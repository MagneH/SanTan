import { ExpandIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const accordion = defineType({
  name: 'accordion',
  type: 'object',
  title: 'Accordion',
  icon: ExpandIcon,
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      description: 'The content of the accordion',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'accordionContent', type: 'array', title: 'Content', of: [{ type: 'block' }] }),
          ],
        },
      ],
    }),
  ],
});
