import urlBuilder from '@sanity/image-url';
import type { PostDocument } from '@/types/post.ts';
import { dataset, projectId } from '@/sanity/projectDetails.ts';
import { basePath, seo } from '@/lib/seo.ts';

export const postMeta = (document: PostDocument, relativeUrl?: string) => {
  const imageBuilder = document.mainImage
    ? urlBuilder({ projectId, dataset })
        .image(document.mainImage)
        .height(600)
        .fit('max')
        .auto('format')
    : null;
  const src = imageBuilder?.url();
  const canonicalUrl = relativeUrl ? `${basePath}${relativeUrl}` : undefined;
  const title = document.title || 'Untitled Post';
  const description = document.seo?.description || document.ingress || 'Article';
  const keywords = document.seo?.keywords;
  const authorName = document.author?.name || 'Unknown author';
  const published = document.publishedAt || document._createdAt;
  const updated = document._updatedAt || published;
  const imageAlt = document.mainImage?.alt || `${title} – feature image`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    url: canonicalUrl,
    datePublished: published,
    dateModified: updated,
    author: [{ '@type': 'Person', name: authorName }],
    image: src
      ? {
          '@type': 'ImageObject',
          url: src,
          caption: imageAlt,
        }
      : undefined,
    mainEntityOfPage: canonicalUrl
      ? {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        }
      : undefined,
  };

  return {
    meta: [
      ...seo({
        title,
        description,
        image: src,
        relativeUrl,
        keywords,
      }),
      ...(canonicalUrl ? [{ rel: 'canonical', href: canonicalUrl }] : []),
      { name: 'author', content: authorName },
      { name: 'article:published_time', content: published },
      { name: 'article:modified_time', content: updated },
      ...(src ? [{ name: 'og:image:alt', content: imageAlt }] : []),
      {
        type: 'application/ld+json',
        textContent: JSON.stringify(jsonLd),
      },
    ],
  };
};
