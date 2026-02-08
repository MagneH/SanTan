import { BlockContentIcon, MobileDeviceIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export const blockContent = defineType({
  title: 'Block content',
  name: 'blockContent',
  type: 'array',
  icon: BlockContentIcon,
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        // Annotations can be any object index – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
          {
            name: 'phoneNumberLink',
            type: 'object',
            title: 'Phone link',
            icon: MobileDeviceIcon,
            fields: [
              {
                name: 'phoneNumber',
                type: 'string',
                title: 'Phone number',
                description: 'e.g., 1234567890',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      title: 'Enriched image',
      name: 'enrichedImage',
      type: 'enrichedImage',
    }),
    defineArrayMember({
      title: 'Accordion',
      name: 'accordion',
      type: 'accordion',
    }),
    defineArrayMember({
      title: 'Image carousel',
      name: 'imageCarousel',
      type: 'imageCarousel',
    }),
  ],
});
