import * as React from 'react';
import { Link } from '@tanstack/react-router';
import { stegaClean } from '@sanity/client/stega';
import {
  allLink,
  card,
  desc,
  emoji,
  emptyState,
  grid,
  headerRow,
  heading,
  link,
  title,
  wrapper,
} from './CategoryShowcase.css.ts';
import type { CategoryStub } from '@/types/category.ts';
import { Route as FullSlugRoute } from '@/routes/$.tsx';

function emojiForCategory(categoryTitle?: string | null) {
  if (!categoryTitle) return '📂';
  const t = categoryTitle.toLowerCase();
  if (t.includes('design')) return '🎨';
  if (t.includes('dev') || t.includes('code')) return '💻';
  if (t.includes('content')) return '✍️';
  if (t.includes('api')) return '🔗';
  if (t.includes('data')) return '📊';
  if (t.includes('performance')) return '⚡';
  if (t.includes('edge')) return '🛰️';
  return '📂';
}

export interface CategoryShowcaseProps {
  categories: Array<CategoryStub>;
  limit?: number;
  headingText?: string;
  showAllLink?: boolean;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  categories,
  limit = 8,
  headingText = 'Categories',
  showAllLink = true,
}) => {
  if (!categories.length) {
    return <div className={emptyState}>No categories available.</div>;
  }
  const sliced = categories.slice(0, limit);
  return (
    <div className={wrapper}>
      <div className={headerRow}>
        <h3 className={heading}>{headingText}</h3>
        {showAllLink && categories.length > limit && (
          <Link to={FullSlugRoute.to} params={{ _splat: '' }} className={allLink} aria-label="See all categories">
            See all
          </Link>
        )}
      </div>
      <ul className={grid} role="list">
        {sliced.map((cat) => (
          <li key={cat.fullSlug ?? cat._createdAt} className={card}>
            <Link
              to={FullSlugRoute.to}
              params={{ _splat: stegaClean(cat.fullSlug) || '' }}
              className={link}
              aria-label={cat.title || undefined}
            >
              <span className={emoji} aria-hidden>
                {emojiForCategory(cat.title)}
              </span>
              <span className={title}>{cat.title}</span>
              {cat.description && <span className={desc}>{cat.description}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
