import { container, ingress as ingressStyle, portableTextContainer, textContainer } from './Post.css.ts';
import type { PostDocument } from '@/types/post.ts';
import type { PageProps } from '@/types/PageProps.ts';
import { MainImage } from '@/components/MainImage/MainImage.tsx';
import { Title } from '@/components/Title/Title.tsx';
import PortableText from '@/components/PortableText/PortableText.tsx';

export const PostPage = ({ data, encodeDataAttribute }: PageProps<PostDocument>) => {
  if (!data) {
    return null;
  }

  const { title, mainImage, body, ingress } = data;

  return (
    <article className={container}>
      <MainImage
        image={mainImage}
        encodeDataAttribute={encodeDataAttribute ? encodeDataAttribute(['mainImage']) : undefined}
      />
      <div className={textContainer}>
        <header>{title ? <Title>{title}</Title> : null}</header>
        {ingress ? <p className={ingressStyle}>{ingress}</p> : null}
        {body && body.length > 0 ? (
          <div className={portableTextContainer}>
            <PortableText value={body} />
          </div>
        ) : null}
      </div>
    </article>
  );
};
