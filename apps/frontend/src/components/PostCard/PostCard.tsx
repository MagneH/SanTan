import { Link } from '@tanstack/react-router';
import { stegaClean } from '@sanity/client/stega';
import urlBuilder from '@sanity/image-url';
import { image, imageContainer, missingImage, postCard, postCardIngress, postCardTitle } from './PostCard.css.ts';
import type { SanityImageType } from '@/types/image.ts';
import { dataset, projectId } from '@/sanity/projectDetails.ts';
import { Route as FullSlugRoute } from '@/routes/$.tsx';

type PostCardProps = {
  fullSlug: string | null | undefined;
  title: string | null | undefined;
  description: string | null | undefined;
  mainImage?: SanityImageType;
};

export function PostCard({ fullSlug, title, description, mainImage }: PostCardProps) {
  return (
    <Link to={FullSlugRoute.to} params={{ _splat: stegaClean(fullSlug) || '' }} className={postCard}>
      <div className={imageContainer}>
        {mainImage ? (
          <img
            className={image}
            src={urlBuilder({ projectId, dataset })
              .image(mainImage)
              .height(700)
              .width(1140)
              .fit('max')
              .auto('format')
              .url()}
            alt={mainImage.alt ?? (title || undefined)}
            loading="lazy"
          />
        ) : (
          <div className={missingImage}>Missing Image</div>
        )}
      </div>
      <h3 className={postCardTitle}>{title}</h3>
      {description && <p className={postCardIngress}>{description}</p>}
    </Link>
  );
}
