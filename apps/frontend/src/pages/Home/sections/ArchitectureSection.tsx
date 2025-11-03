import { callout, codeBlock, miniBadge, miniBadgeRow, paragraph, subtleHeading, twoCol, wideSection } from '../Home.css.ts';

interface ArchitectureSectionProps {
  badges: Array<string>;
}

export function ArchitectureSection({ badges }: ArchitectureSectionProps) {
  return (
    <section className={wideSection} aria-labelledby="architecture-heading">
      <div className={subtleHeading} id="architecture-heading">Architecture</div>
      <div className={twoCol}>
        <div>
          <p className={paragraph}>
            Santan Starter combines <strong>TanStack Start</strong> for routing & data synchronization, <strong>React 19</strong> for
            modern rendering semantics, and <strong>Sanity</strong> for structured, real‑time content authoring. The result is a
            fluid authoring→publishing loop with minimal glue code.
          </p>
          <p className={paragraph}>
            Content queries are organized, cached, and invalidated intelligently. Preview mode uses a reactive store to switch
            data sources without a full page reload.
          </p>
          <div className={miniBadgeRow}>
            {badges.map(b => (<span className={miniBadge} key={b}>{b}</span>))}
          </div>
        </div>
        <div className={callout}>
          <div style={{fontWeight:600, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'#005bb5'}}>Data Flow</div>
          <pre className={codeBlock} aria-label="Data flow example"><code>{`Client Request
   │
   ├─ Route Loader (decides preview vs published)
   │    ├─ Preview: reactive store + live query
   │    └─ Published: cached query via TanStack Query
   │
   └─ Component hydrates with adaptive source`}</code></pre>
          <p className={paragraph} style={{fontSize:'0.85rem'}}>
            Clear separation of preview vs published pathways keeps production lean while enabling instant editorial feedback.
          </p>
        </div>
      </div>
    </section>
  );
}
