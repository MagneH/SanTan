import urlBuilder from '@sanity/image-url';
import { container, imageStyle, missingImage } from './MainImage.css.ts';

import type { SanityImageType } from '@/types/image.ts';
import { dataset, projectId } from '@/sanity/projectDetails.ts';

type MainImageProps = {
  image?: SanityImageType;
  encodeDataAttribute?: string;
};

export function MainImage({ image, encodeDataAttribute }: MainImageProps) {
  return (
    <div className={container}>
      {image ? (
        <img
          data-sanity={encodeDataAttribute}
          className={imageStyle}
          src={urlBuilder({ projectId, dataset }).image(image).height(700).width(1140).fit('max').auto('format').url()}
          alt={image.alt ?? ``}
          loading="lazy"
        />
      ) : (
        <div className={missingImage}>Missing Record art</div>
      )}
    </div>
  );
}
