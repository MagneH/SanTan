import { Link } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Home, Sun, Moon } from 'lucide-react';
import {
  header,
  brand,
  desktopNav,
  navLink,
  navLinkActive,
  spacer,
  mobileMenuButton,
  mobilePanel,
  mobilePanelHidden,
  mobilePanelHeader,
  closeButton,
  mobileNavList,
  mobileNavLink,
  mobileNavLinkActive,
  overlay,
  overlayHidden,
  themeToggle,
} from './Header.css.ts';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => { setMounted(true); }, []);

  // Prevent background scroll when mobile menu open
  useEffect(() => {
    if (!mounted) return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open, mounted]);

  // Apply theme to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <>
      <header className={header}>
        <Link to="/" className={brand}>SanTan</Link>
        <nav className={desktopNav} aria-label="Main navigation">
          {NAV_ITEMS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: navLinkActive }}
              activeOptions={{ exact: true }}
              className={navLink}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className={spacer} />
        <button
          className={themeToggle}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          className={mobileMenuButton}
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
        className={open ? overlay : overlayHidden}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* Mobile Panel */}
      <aside
        id="mobile-nav"
        className={open ? mobilePanel : mobilePanelHidden}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        <div className={mobilePanelHeader}>
          <Link to="/" className={brand} onClick={() => setOpen(false)}>SanTan</Link>
          <button
            className={closeButton}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className={mobileNavList}>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              activeProps={{ className: mobileNavLinkActive }}
              activeOptions={{ exact: true }}
              className={mobileNavLink}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
