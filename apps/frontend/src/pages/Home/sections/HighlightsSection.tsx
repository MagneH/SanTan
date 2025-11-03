import { highlightCard, highlightIcon, highlightText, highlightTitle, highlightsGrid, section, subtleHeading } from '../Home.css.ts';

const HIGHLIGHTS = [
  { icon: '🧩', title: 'Composable', text: 'A modular approach lets you swap or extend data layers & UI without friction.' },
  { icon: '🛰️', title: 'Edge Ready', text: 'Built on modern primitives that thrive in distributed & edge environments.' },
  { icon: '🔄', title: 'Reactive Preview', text: 'Instant visual updates while you edit structured content in Sanity.' },
  { icon: '🛡️', title: 'Type Safe', text: 'End‑to‑end TypeScript models keep refactors safe & confident.' },
];

export function HighlightsSection() {
  return (
    <section className={section} aria-labelledby="highlights-heading">
      <div className={subtleHeading} id="highlights-heading">Highlights</div>
      <div className={highlightsGrid}>
        {HIGHLIGHTS.map(h => (
          <div className={highlightCard} key={h.title}>
            <span className={highlightIcon}>{h.icon}</span>
            <h4 className={highlightTitle}>{h.title}</h4>
            <p className={highlightText}>{h.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
