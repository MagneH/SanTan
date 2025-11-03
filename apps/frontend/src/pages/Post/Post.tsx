import { container, ingress as ingressStyle, portableTextContainer, textContainer, authorAvatar, authorBlock, metaBar, metaItem, metaSeparator } from './Post.css.ts';
import type { PostDocument } from '@/types/post.ts';
import type { PageProps } from '@/types/PageProps.ts';
import { MainImage } from '@/components/MainImage/MainImage.tsx';
import { Title } from '@/components/Title/Title.tsx';
import PortableText from '@/components/PortableText/PortableText.tsx';
import { sanityImageSrcBuilder } from '@/sanity/sanityImageSrcBuilder.ts';

export const PostPage = ({ data, encodeDataAttribute }: PageProps<PostDocument>) => {
  if (!data) {
    return null;
  }

  const { title, mainImage, body, ingress, author, publishedAt, _updatedAt, fullSlug } = data as PostDocument & { fullSlug?: string | null };

  // Ekstraher plain text for lesetid & JSON-LD
  const plainText = body?.filter(b=>b._type==='block').map(b=>b.children?.map(c=>('text' in c ? c.text : '')).join(' ')||'').join(' ')||'';
  const wordCount = plainText ? plainText.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingMinutes = wordCount > 0 ? Math.max(1, Math.round(wordCount / 180)) : 0;

  const publishedISO = publishedAt ? new Date(publishedAt).toISOString() : undefined;
  const updatedISO = _updatedAt ? new Date(_updatedAt).toISOString() : undefined;

  const publishedDisplay = publishedAt ? new Date(publishedAt).toLocaleDateString('no-NO', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const updatedDisplay = _updatedAt ? new Date(_updatedAt).toLocaleDateString('no-NO', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

  const mainImageRef = mainImage?.asset?._ref;
  const mainImageUrl = mainImageRef ? sanityImageSrcBuilder({ id: mainImageRef, width: 1200 }) : undefined;
  const authorName = author?.name || undefined;

  const siteName = 'SanTan Starter';
  const publisherLogo = '/tanstack-word-logo-white.svg';
  const categoriesList = (data as any).categories?.map((c: any) => c?.title).filter(Boolean) || [];
  const keywords = data.seo?.keywords || categoriesList;
  // Canonical uten window fallback
  const canonicalUrl = fullSlug ? `/${fullSlug}` : '/';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title || undefined,
    image: mainImageUrl,
    datePublished: publishedISO,
    dateModified: updatedISO || publishedISO,
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: publisherLogo ? { '@type': 'ImageObject', url: publisherLogo } : undefined,
    },
    description: ingress || undefined,
    articleSection: categoriesList[0] || undefined,
    keywords: keywords && keywords.length ? keywords.join(', ') : undefined,
    wordCount: wordCount || undefined,
    timeRequired: readingMinutes ? `PT${readingMinutes}M` : undefined,
    mainEntityOfPage: canonicalUrl ? { '@type': 'WebPage', '@id': canonicalUrl } : undefined,
    url: canonicalUrl,
  };

  return (
    <article className={container}>
      <MainImage
        image={mainImage}
        encodeDataAttribute={encodeDataAttribute ? encodeDataAttribute(['mainImage']) : undefined}
      />
      <div className={textContainer}>
        <header>{title ? <Title>{title}</Title> : null}</header>
        <div className={metaBar}>
          {author && (
            <div className={authorAvatar} data-sanity={encodeDataAttribute ? encodeDataAttribute(['author']) : undefined}>
              {author.image && author.image.asset?._ref ? (
                <img
                  src={sanityImageSrcBuilder({ id: author.image.asset._ref, width: 88 })}
                  alt={author.name || 'Forfatter'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                (author.name || 'U').split(' ').map(w => w[0]).join('').slice(0,2)
              )}
            </div>
          )}
          {authorName && <span className={metaItem}>{authorName}</span>}
          {publishedDisplay && (
            <><span className={metaSeparator}>•</span><time className={metaItem} dateTime={publishedISO}>{publishedDisplay}</time></>
          )}
          {updatedDisplay && (
            <><span className={metaSeparator}>•</span><time className={metaItem} dateTime={updatedISO}>Oppdatert: {updatedDisplay}</time></>
          )}
          {readingMinutes > 0 && (
            <><span className={metaSeparator}>•</span><span className={metaItem}>{readingMinutes} min lesetid</span></>
          )}
        </div>
        {ingress ? <p className={ingressStyle}>{ingress}</p> : null}
        {/* JSON-LD for søkemotorer */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {body && body.length > 0 ? (
          <div className={portableTextContainer}>
            <PortableText value={body} />
          </div>
        ) : null}
      </div>
    </article>
  );
};
