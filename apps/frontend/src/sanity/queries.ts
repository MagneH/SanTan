import groq from 'groq';

export const POSTS_QUERY = groq`*[_type == "post"][0...12]|order(title asc){
    _id,
    _type,
    title,
    releaseDate,
    "slug": slug.current,
    "artist": artist->name,
    image
  } | order(releaseDate desc)`;

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0]{
  ...,
  _id,
  title,
  "slug": slug.current,
  // for simplicity in this demo these are typed as "any"
  // we can make them type-safe with a little more work
  // https://www.simeongriggs.dev/type-safe-groq-queries-for-sanity-data-with-zod
  "author": author->{ name, image },
  "categories": categories[]->{ title, description, slug },
  publishedAt,
  mainImage,
  body
}`;
