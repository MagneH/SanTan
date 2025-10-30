import type { SlugRule } from 'sanity';

export const isUniqueAcrossDocumentTypes = (R: SlugRule) =>
  R.custom(async (value, context) => {
    if (!value) return true; // Skip if optional and empty

    const client = context.getClient({ apiVersion: '2022-12-07' });
    const query = `count(*[slug.current == $value && _id != $id && !(_id in path('drafts.**'))]) == 0`;

    const result = await client.fetch(query, {
      value: value.current,
      id: context.document?._id.replace(/^drafts\./, ''),
    });
    return result || 'Slug must be unique across all document types';
  });
