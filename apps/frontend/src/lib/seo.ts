import AppLogo from '../../public/web-app-manifest-512x512.png?url';

const basePath = import.meta.env.VITE_BASE_PATH || process.env.VITE_BASE_PATH;

export const seo = ({
  title,
  description,
  keywords,
  image = `${basePath}${AppLogo.replace('/public', '')}`,
  relativeUrl,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string | Array<string>;
  relativeUrl?: string;
}) => {
  const absoluteUrl = relativeUrl ? `${basePath}${relativeUrl}` : undefined;
  const keywordsString = Array.isArray(keywords) ? keywords.join(', ') : keywords;

  return [
    { title },
    { name: 'twitter:title', content: title },
    { name: 'og:title', content: title },
    { name: 'og:type', content: 'website' },
    { name: 'twitter:image', content: image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'og:image', content: image },
    ...(description
      ? [
          { name: 'description', content: description },
          { name: 'twitter:description', content: description },
          { name: 'og:description', content: description },
        ]
      : []),
    ...(keywordsString ? [{ name: 'keywords', content: keywordsString }] : []),
    ...(absoluteUrl
      ? [
          { name: 'og:url', content: absoluteUrl },
          { name: 'twitter:url', content: absoluteUrl },
        ]
      : []),
  ];
};
