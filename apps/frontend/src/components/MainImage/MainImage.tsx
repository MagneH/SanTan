import { createImageUrlBuilder } from '@sanity/image-url';
import { useEffect, useRef, useState } from 'react';
import {
  aspectWrapper,
  container,
  imgActual,
  placeholderInner,
  placeholderWrapper,
  portraitImg,
  portraitWrapper,
  skeleton,
} from './MainImage.css.ts';

import type { SanityImageType } from '@/types/image.ts';
import { dataset, projectId } from '@/sanity/projectDetails.ts';

type MainImageProps = {
  image?: SanityImageType;
  encodeDataAttribute?: string;
};

export function MainImage({ image, encodeDataAttribute }: MainImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      // The image was already cached at render time
      setLoaded(true);
    }
  }, []);

  if (!image) {
    return (
      <div className={container}>
        <div className={placeholderWrapper} data-sanity={encodeDataAttribute}>
          <div className={placeholderInner}>
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="14" rx="2" ry="2" />
              <circle cx="8" cy="8" r="2" />
              <path d="M3 17l4.5-4.5a2 2 0 0 1 2.8 0L17 17" />
              <path d="M14 14l3-3 4 4" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Parse dimensions from Sanity asset ref: image-<id>-<width>x<height>-<format>
  const ref = image.asset?._ref;
  let originalWidth: number | undefined;
  let originalHeight: number | undefined;
  if (ref) {
    const parts = ref.split('-');
    const dimsPart = parts.find((p) => /x/.test(p));
    if (dimsPart) {
      const [wStr, hStr] = dimsPart.split('x');
      const w = parseInt(wStr, 10);
      const h = parseInt(hStr, 10);
      if (!isNaN(w) && !isNaN(h)) {
        originalWidth = w;
        originalHeight = h;
      }
    }
  }

  // Apply crop to get effective dimensions
  const crop = image.crop;
  if (crop && originalWidth && originalHeight) {
    const cropLeft = crop.left ?? 0;
    const cropRight = crop.right ?? 0;
    const cropTop = crop.top ?? 0;
    const cropBottom = crop.bottom ?? 0;
    originalWidth = Math.round(originalWidth * (1 - cropLeft - cropRight));
    originalHeight = Math.round(originalHeight * (1 - cropTop - cropBottom));
  }

  // Fallback ratio 16:9 if missing
  const ratio = originalWidth && originalHeight ? originalHeight / originalWidth : 9 / 16;
  const isPortrait = ratio > 1.05; // slight margin for near-square

  const builder = createImageUrlBuilder({ projectId, dataset }).image(image);
  // Generate responsive widths
  const widths = [480, 768, 1024, 1280];
  const srcSet = widths
    .map((w) => {
      const h = Math.round(w * ratio);
      return `${builder.width(w).height(h).auto('format').url()} ${w}w`;
    })
    .join(', ');
  const largestWidth = 1280;
  const largestHeight = Math.round(largestWidth * ratio);
  const largest = builder.width(largestWidth).height(largestHeight).auto('format').url();

  // Low quality placeholder (LQIP) was previously used but is removed now
  // const lqipWidth = 40;
  // const lqipHeight = Math.max(1, Math.round(lqipWidth * ratio));
  // const lqip = builder.width(lqipWidth).height(lqipHeight).blur(50).auto('format').url();

  return (
    <div className={container}>
      {isPortrait ? (
        <div className={portraitWrapper} data-sanity={encodeDataAttribute}>
          {!loaded && (
            <div
              className={skeleton}
              aria-hidden="true"
              style={{ transition: 'opacity 0.4s ease', opacity: 0.6, position: 'absolute' }}
            />
          )}
          <img
            ref={imgRef}
            className={portraitImg}
            src={largest}
            srcSet={srcSet}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 70vw, 800px"
            alt={image.alt || ''}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          />
        </div>
      ) : (
        <div className={aspectWrapper} data-sanity={encodeDataAttribute} style={{ paddingBottom: `${ratio * 100}%` }}>
          {!loaded && (
            <div className={skeleton} aria-hidden="true" style={{ transition: 'opacity 0.4s ease', opacity: 0.6 }} />
          )}
          <img
            ref={imgRef}
            className={imgActual}
            src={largest}
            srcSet={srcSet}
            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 90vw, 1140px"
            alt={image.alt || ''}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
          />
        </div>
      )}
    </div>
  );
}
