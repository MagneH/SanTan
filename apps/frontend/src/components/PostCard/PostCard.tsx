import { Link } from '@tanstack/react-router';
import { stegaClean } from '@sanity/client/stega';
import urlBuilder from '@sanity/image-url';
import { image, imageContainer, missingImage, postCard, postCardContent, postCardIngress, postCardTitle } from './PostCard.css.ts';
import type { SanityImageType } from '@/types/image.ts';
import { dataset, projectId } from '@/sanity/projectDetails.ts';
import { Route as FullSlugRoute } from '@/routes/$.tsx';

type PostCardProps = {
  fullSlug: string | null | undefined;
  title: string | null | undefined;
  description: string | null | undefined;
  mainImage?: SanityImageType | null | undefined;
};

export function PostCard({ fullSlug, title, description, mainImage }: PostCardProps) {
  const imageUrl = mainImage
    ? urlBuilder({ projectId, dataset })
        .image(mainImage)
        .height(700)
        .width(1140)
        .fit('max')
        .auto('format')
        .url()
    : null;
  return (
    <Link to={FullSlugRoute.to} params={{ _splat: stegaClean(fullSlug) || '' }} className={postCard}>
      <div className={imageContainer}>
        {imageUrl ? (
          <img
            className={image}
            src={imageUrl}
            alt={mainImage?.alt ?? title ?? 'Post image'}
            loading="lazy"
          />
        ) : (
          <div className={missingImage} aria-hidden>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Placeholder">
              <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
              <path d="M3 14l4-4 4 4 4-4 4 4" />
              <circle cx="8.5" cy="8.5" r="1.25" />
            </svg>
          </div>
        )}
      </div>
      <div className={postCardContent}>
        <h3 className={postCardTitle}>{title}</h3>
        {description && <p className={postCardIngress}>{description}</p>}
      </div>
    </Link>
  );
}
