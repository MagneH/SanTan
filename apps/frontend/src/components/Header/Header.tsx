import { Link } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { Home, Menu, Moon, Sun, X } from 'lucide-react';
import * as styles from './Header.css.ts';
import { darkTheme, lightTheme } from '@/styles/theme.css.ts';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // Deterministic initial theme to avoid SSR/client mismatch. Real preference applied after mount.
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // On mount, determine preferred theme from existing data-theme attr or storage / media
  useEffect(() => {
    setMounted(true);
    try {
      let preferred: 'light' | 'dark' = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      if (preferred === 'light') {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') preferred = stored;
        else if (window.matchMedia('(prefers-color-scheme: dark)').matches) preferred = 'dark';
      }
      if (preferred !== theme) setTheme(preferred);
    } catch {}
  }, []);

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open, mounted]);

  // Apply theme to <html> when theme changes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.remove(lightTheme);
      root.classList.add(darkTheme);
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove(darkTheme);
      root.classList.add(lightTheme);
    }
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>SanTan</Link>
        <nav className={styles.desktopNav} aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: styles.navLinkActive }}
              activeOptions={{ exact: true }}
              className={styles.navLink}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className={styles.spacer} />
        <button
          className={styles.themeToggle}
          aria-label="Toggle color theme"
          onClick={toggleTheme}
        >
          <span className={styles.themeIconWrapper} aria-hidden>
            <Sun size={18} className={styles.sunIcon} />
            <Moon size={18} className={styles.moonIcon} />
          </span>
        </button>
        <button
          className={styles.mobileMenuButton}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(o => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Overlay */}
      <div
        className={open ? styles.overlay : styles.overlayHidden}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Mobile Panel */}
      <aside
        id="mobile-nav"
        className={open ? styles.mobilePanel : styles.mobilePanelHidden}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        <div className={styles.mobilePanelHeader}>
          <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>SanTan</Link>
          <button
            className={styles.closeButton}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className={styles.mobileNavList}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              activeProps={{ className: styles.mobileNavLinkActive }}
              activeOptions={{ exact: true }}
              className={styles.mobileNavLink}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
