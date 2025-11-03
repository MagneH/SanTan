import groq from 'groq';

export const POST_QUERY_FIELDS = `
  _id,
  title,
  fullSlug,
  // for simplicity in this demo these are typed as "any"
  // we can make them type-safe with a little more work
  // https://www.simeongriggs.dev/type-safe-groq-queries-for-sanity-data-with-zod
  "author": author->{ name, image },
  "categories": categories[]->{ title, description, slug },
  publishedAt,
  _updatedAt,
  mainImage,  
  ingress,
  body,
  seo,
  _createdAt
`;

export const POST_STUB_QUERY_FIELDS = `
  _id,
  title,
  fullSlug,
  ingress,
  mainImage,
  _createdAt,
  publishedAt
`;

export function getPostsQuery(limit = 6) {
  return groq`
    *[
      _type == "post" && !(_id in path('drafts.**')) &&
      (
        !defined($lastPublishedAt) ||
        publishedAt < $lastPublishedAt ||
        (publishedAt == $lastPublishedAt && _id < $lastId)
      )
    ]
    | order(publishedAt desc)[0...${limit}]{
      ${POST_STUB_QUERY_FIELDS}
    }
  `;
}
