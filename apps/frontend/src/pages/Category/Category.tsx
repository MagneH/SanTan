import { container, ingress as ingressStyle, keywordItem, keywordsList, keywordsSection, keywordsTitle, textContainer } from './Category.css.ts';
import type { PageProps } from '@/types/PageProps.ts';
import type { CategoryDocument } from '@/types/category.ts';
import { MainImage } from '@/components/MainImage/MainImage.tsx';
import { Title } from '@/components/Title/Title.tsx';

export const CategoryPage = ({ data, encodeDataAttribute }: PageProps<CategoryDocument>) => {
  if (!data) {
    return null;
  }

  const { title, mainImage, description, seo } = data;

  return (
    <article className={container}>
      {typeof mainImage !== 'undefined' ? (
        <MainImage
          image={mainImage}
          encodeDataAttribute={encodeDataAttribute ? encodeDataAttribute(['mainImage']) : undefined}
        />
      ) : null}
      <div className={textContainer}>
        <header>{title ? <Title>{title}</Title> : null}</header>
        {description ? <p className={ingressStyle}>{description}</p> : null}
        {seo?.keywords && seo.keywords.length > 0 ? (
          <div className={keywordsSection}>
            <h2 className={keywordsTitle}>Topics</h2>
            <ul className={keywordsList}>
              {seo.keywords.map((keyword: string | undefined, index: number) => (
                <li key={index} className={keywordItem}>{keyword}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
};
