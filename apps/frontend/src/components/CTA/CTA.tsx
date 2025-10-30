import { ctaActions, ctaInner, ctaOuter, ctaPrimary, ctaSecondary, ctaText, ctaTitle } from './CTA.css.ts';

export function CTA() {
  return (
    <section className={ctaOuter} aria-labelledby="cta-heading">
      <div className={ctaInner}>
        <div>
          <h2 id="cta-heading" className={ctaTitle}>Kickstart your content platform</h2>
          <p className={ctaText}>
            Clone the repo, connect your Sanity project, and start shipping structured content in minutes.
          </p>
        </div>
        <div className={ctaActions}>
          <a className={ctaPrimary} href="https://github.com/MagneH/SanTan" target="_blank" rel="noopener noreferrer">View on GitHub</a>
          <a className={ctaSecondary} href="https://github.com/MagneH/SanTan/blob/main/README.md" target="_blank" rel="noopener noreferrer">Docs</a>
        </div>
      </div>
    </section>
  );
}
