import urlBuilder from '@sanity/image-url';
import { dataset, projectId } from '@/sanity/projectDetails.ts';

export const sanityImageSrcBuilder = ({ id, width: imageWidth }: { id: string; width: number }) => {
  return urlBuilder({ projectId, dataset }).image(id).width(imageWidth).fit('max').auto('format').url();
};
