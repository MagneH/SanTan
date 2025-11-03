import { bottomRow, brandBlock, brandName, brandTagline, footer, footerLink, groupTitle, heart, linkGroup, metaItem, smallMeta, topRow } from './Footer.css.ts';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={footer} role="contentinfo">
      <div className={topRow}>
        <div className={brandBlock}>
          <div className={brandName}>SanTan Starter</div>
          <p className={brandTagline}>
            A modern content platform powered by React, TanStack Start & Sanity. Built for speed, preview, and elegant DX.
          </p>
        </div>
        <nav className={linkGroup} aria-label="Resources">
          <div className={groupTitle}>Resources</div>
          <a className={footerLink} href="https://github.com/MagneH/SanTan" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className={footerLink} href="https://github.com/MagneH/SanTan/blob/main/README.md" target="_blank" rel="noopener noreferrer">Docs</a>
          <a className={footerLink} href="https://www.sanity.io" target="_blank" rel="noopener noreferrer">Sanity.io</a>
          <a className={footerLink} href="https://tanstack.com" target="_blank" rel="noopener noreferrer">TanStack</a>
        </nav>
      </div>
      <div className={bottomRow}>
        <div className={smallMeta}>
          <span className={metaItem}>© {year} SanTan Starter</span>
          <span className={metaItem}>Made with <span className={heart}>♥</span> using TanStack & Sanity</span>
        </div>
        <div className={smallMeta}>
          <span className={metaItem}><a className={footerLink} href="https://github.com/MagneH/SanTan/issues" target="_blank" rel="noopener noreferrer">Issues</a></span>
          <span className={metaItem}><a className={footerLink} href="mailto:example@example.com">Contact</a></span>
        </div>
      </div>
    </footer>
  );
}
