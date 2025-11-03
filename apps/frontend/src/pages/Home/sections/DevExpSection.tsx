import { callout, paragraph, subtleHeading, twoCol, wideSection, devExpList } from '../Home.css.ts';

export function DevExpSection() {
  return (
    <section className={wideSection} aria-labelledby="devexp-heading">
      <div className={subtleHeading} id="devexp-heading">Developer Experience</div>
      <div className={twoCol}>
        <div>
          <p className={paragraph}>
            The stack emphasizes fast iteration: portable query helpers, reusable layout primitives, and co-located types reduce
            friction. Vanilla Extract ensures design tokens stay type safe and themeable.
          </p>
          <p className={paragraph}>
            You can extend this starter with auth, comments, multi‑tenant spaces or edge personalization without reworking the
            fundamentals.
          </p>
        </div>
        <div className={callout}>
          <div style={{fontWeight:600, fontSize:'0.85rem', letterSpacing:'0.08em', textTransform:'uppercase', color:'#005bb5'}}>Why It Feels Fast</div>
          <ul className={devExpList}>
            <li>Granular route loaders</li>
            <li>Selective live preview hydration</li>
            <li>Edge‑friendly query patterns</li>
            <li>Progressive image loading</li>
            <li>Minimal global JS</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
