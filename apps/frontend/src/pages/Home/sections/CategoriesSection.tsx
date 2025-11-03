import { section, sectionTitle } from '../Home.css.ts';
import type { CategoryStub } from '@/types/category.ts';
import { CategoryShowcase } from '@/components/CategoryShowcase/CategoryShowcase.tsx';

interface CategoriesSectionProps {
  categories: Array<CategoryStub>;
}
export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className={section}>
      <h2 className={sectionTitle}>Explore Categories</h2>
      <CategoryShowcase categories={categories} limit={9} headingText="" showAllLink={false} />
    </section>
  );
}
