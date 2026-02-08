import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

globalStyle('html, body', { margin: 0 });

globalStyle('body', {
  fontFamily: 'Source Sans 3, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
  background: vars.color.bg,
  color: vars.color.text,
  transition: 'background .4s ease, color .35s ease',
  minHeight: '100vh',
});

globalStyle('[data-theme="dark"] body', {
  background: vars.color.bg, // navy blue from darkTheme
  color: vars.color.text,
});

// Optional smoothing
globalStyle('body', { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' });

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
});
