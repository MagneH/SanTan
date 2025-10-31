import { Link } from '@tanstack/react-router';
import { stegaClean } from '@sanity/client/stega';
import { useEffect, useRef, useState } from 'react';
import { pill, pillAnimated, pillDescription, pillEmoji, pillGridFallback, pillListWrapper, pillScroller, pillTitle, srOnly, pillIn } from './CategoryPill.css.ts';
import type { CategoryStub } from '@/types/category.ts';
import { Route as FullSlugRoute } from '@/routes/$.tsx';

function emojiForCategory(title?: string | null) {
  if (!title) return '📂';
  const t = title.toLowerCase();
  if (t.includes('design')) return '🎨';
  if (t.includes('dev') || t.includes('code')) return '💻';
  if (t.includes('content')) return '✍️';
  if (t.includes('api')) return '🔗';
  if (t.includes('data')) return '📊';
  if (t.includes('performance')) return '⚡';
  if (t.includes('edge')) return '🛰️';
  return '📂';
}

export interface CategoryPillListProps {
  categories: Array<CategoryStub>;
}

export function CategoryPillList({ categories }: CategoryPillListProps) {
  if (!categories.length) return null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const hoverTimers = useRef<Record<string, number>>({});
  const liveRef = useRef<HTMLDivElement | null>(null);

  const clearTimer = (id: string) => {
    const handle = hoverTimers.current[id];
    if (handle) {
      clearTimeout(handle);
      delete hoverTimers.current[id];
    }
  };

  const handleEnter = (id: string) => {
    clearTimer(id);
    hoverTimers.current[id] = window.setTimeout(() => setActiveId(id), 120); // small delay to prevent flicker
  };
  const handleLeave = (id: string) => {
    clearTimer(id);
    if (activeId === id) setActiveId(null);
  };
  const handleFocus = (id: string) => {
    setActiveId(id);
  };
  const handleBlur = (id: string, e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (activeId === id) setActiveId(null);
    }
  };

  // Escape closes active tooltip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeId) {
        setActiveId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId]);

  // Announce tooltip changes (accessibility enhancement)
  useEffect(() => {
    if (!liveRef.current) return;
    if (!activeId) {
      liveRef.current.textContent = '';
      return;
    }
    const cat = categories.find(c => (c.fullSlug ?? c._createdAt) === activeId);
    if (cat?.description) {
      liveRef.current.textContent = `${cat.title}: ${cat.description}`;
    } else if (cat?.title) {
      liveRef.current.textContent = cat.title;
    }
  }, [activeId, categories]);

  // Normalize trackpad vertical scroll into horizontal scroll (desktop only)
  useEffect(() => {
    const scroller = containerRef.current?.querySelector(`.${pillScroller}`) as HTMLElement | null;
    if (!scroller) return;
    const handler = (e: WheelEvent) => {
      if (e.deltaY !== 0 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // prevent vertical page scroll if we can scroll horizontally
        if ((e.deltaY > 0 && scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth) || (e.deltaY < 0 && scroller.scrollLeft > 0)) {
          e.preventDefault();
          scroller.scrollLeft += e.deltaY * 0.85;
        }
      }
    };
    scroller.addEventListener('wheel', handler, { passive: false });
    return () => scroller.removeEventListener('wheel', handler);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setAnimateIn(true);
      return;
    }
    requestAnimationFrame(() => setAnimateIn(true));
  }, []);

  // Ved resize: sørg for at pillene alltid har synlig klassestatus
  useEffect(() => {
    const onResize = () => setAnimateIn(true);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className={pillListWrapper} ref={containerRef}>
      <div ref={liveRef} className={srOnly} aria-live="polite" aria-atomic="true" />
      {/* Mobile / small screen scroller */}
      <div className={pillScroller} role="list">
        {categories.map((cat) => (
          <Link
            key={cat.fullSlug ?? cat._createdAt}
            to={FullSlugRoute.to}
            params={{ _splat: stegaClean(cat.fullSlug) || '' }}
            className={`${pill} ${animateIn ? pillIn : pillAnimated}`}
            data-pill
            data-active={activeId === (cat.fullSlug ?? cat._createdAt) ? 'true' : 'false'}
            role="listitem"
            aria-describedby={cat.description ? `cat-desc-${cat._createdAt}` : undefined}
            aria-label={cat.title || undefined}
            onMouseEnter={() => handleEnter(cat.fullSlug ?? cat._createdAt)}
            onMouseLeave={() => handleLeave(cat.fullSlug ?? cat._createdAt)}
            onFocus={() => handleFocus(cat.fullSlug ?? cat._createdAt)}
            onBlur={(e) => handleBlur(cat.fullSlug ?? cat._createdAt, e)}
          >
            <span className={pillEmoji} aria-hidden>{emojiForCategory(cat.title)}</span>
            <span className={pillTitle}>{cat.title}</span>
            {cat.description && (
              <span id={`cat-desc-${cat._createdAt}`} className={pillDescription} role="tooltip" aria-hidden={activeId === (cat.fullSlug ?? cat._createdAt) ? 'false' : 'true'}>
                {cat.description}
              </span>
            )}
          </Link>
        ))}
      </div>
      {/* Desktop fallback grid alignment */}
      <div className={pillGridFallback} aria-hidden>
        {categories.map((cat) => (
          <Link
            key={'grid-' + (cat.fullSlug ?? cat._createdAt)}
            to={FullSlugRoute.to}
            params={{ _splat: stegaClean(cat.fullSlug) || '' }}
            className={pill}
          >
            <span className={pillEmoji} aria-hidden>{emojiForCategory(cat.title)}</span>
            <span className={pillTitle}>{cat.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
