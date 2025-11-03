import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${vars.color.bg} 0%, ${vars.color.bgAlt} 50%, ${vars.color.bgSoft} 100%)`,
  paddingTop: '3rem',
  paddingBottom: '7rem',
  '@media': {
    'screen and (max-width: 768px)': {
      paddingTop: '2rem',
    },
  },
});

export const textContainer = style({
  maxWidth: '46rem',
  width: '100%',
  paddingLeft: '2.5rem',
  paddingRight: '2.5rem',
  '@media': {
    'screen and (max-width: 768px)': {
      paddingLeft: '1.25rem',
      paddingRight: '1.25rem',
    },
  },
});

export const ingress = style({
  maxWidth: '42rem',
  fontSize: '1.375rem',
  fontWeight: 300,
  lineHeight: 1.7,
  marginBottom: '3.5rem',
  marginTop: '1.75rem',
  letterSpacing: '-0.01em',
  color: vars.color.text,
  fontStyle: 'italic',
  position: 'relative',
  paddingLeft: '1.15rem',
  borderLeft: `4px solid ${vars.color.primary}`,
  background: `linear-gradient(90deg, ${vars.color.accentSoft} 0%, transparent 65%)`,
  boxShadow: 'inset 0 0 0 999px rgba(255,255,255,0.02)',
  selectors: {
    '[data-theme="dark"] &': {
      color: '#F5F9FC',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
      boxShadow: 'inset 0 0 0 999px rgba(0,0,0,0.08)',
      borderLeft: `4px solid ${vars.color.primaryAlt}`,
    },
  },
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.2rem',
      marginBottom: '3rem',
      paddingLeft: '0.9rem',
      borderLeft: `3px solid ${vars.color.primary}`,
    },
  },
});

export const portableTextContainer = style({
  width: '100%',
  maxWidth: '46rem',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '2.75rem',
});

// Heading refinements
globalStyle(`${portableTextContainer} > *:not(p)`, {
  marginTop: '3rem',
  marginBottom: '1.4rem',
  color: vars.color.text,
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} > *:not(p)`, {
  color: '#F5F9FC',
});

globalStyle(`${portableTextContainer} h2`, {
  fontSize: '2rem',
  marginTop: '3.5rem',
  marginBottom: '1.25rem',
});

globalStyle(`${portableTextContainer} h3`, {
  fontSize: '1.6rem',
  marginTop: '3rem',
  marginBottom: '1.1rem',
});

globalStyle(`${portableTextContainer} h4`, {
  fontSize: '1.35rem',
  marginTop: '2.5rem',
  marginBottom: '.9rem',
  fontWeight: 500,
});

// Avoid huge top gap if first element is heading
globalStyle(`${portableTextContainer} > :first-child`, {
  marginTop: '0 !important',
});

// Paragraphs
globalStyle(`${portableTextContainer} p`, {
  lineHeight: 1.7,
  fontSize: '1.05rem',
  marginBottom: '1.6rem',
  color: vars.color.textDim,
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} p`, {
  color: '#E4E9EF',
});

// Links
globalStyle(`${portableTextContainer} a`, {
  color: vars.color.primary,
  textDecoration: 'none',
  borderBottom: `1px solid ${vars.color.borderSoft}`,
  fontWeight: 500,
});
globalStyle(`${portableTextContainer} a:hover`, {
  color: vars.color.primaryAlt,
  borderBottomColor: vars.color.primaryAlt,
});
// Dark override
globalStyle(`[data-theme="dark"] ${portableTextContainer} a`, {
  color: vars.color.primary,
});

// Lists
globalStyle(`${portableTextContainer} ul, ${portableTextContainer} ol`, {
  color: vars.color.textDim,
  lineHeight: 1.6,
  fontSize: '1.05rem',
  marginBottom: '2rem',
  marginTop: '1.5rem',
  paddingLeft: '1.75rem',
});
globalStyle(`${portableTextContainer} li`, {
  marginBottom: '.65rem',
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} ul, [data-theme="dark"] ${portableTextContainer} ol`, {
  color: '#E4E9EF',
});

// Inline code
globalStyle(`${portableTextContainer} code`, {
  background: 'rgba(0,0,0,0.06)',
  padding: '0.4rem 0.75rem',
  borderRadius: '0.625rem',
  fontSize: '.95rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  color: vars.color.primary,
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} code`, {
  background: 'rgba(255,255,255,0.12)',
  color: '#F5F9FC',
});

// Code blocks
globalStyle(`${portableTextContainer} pre`, {
  background: vars.color.surfaceElevated,
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: '1.25rem',
  padding: '2rem',
  marginTop: '2.5rem',
  marginBottom: '2.5rem',
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} pre`, {
  background: 'rgba(255,255,255,0.06)',
  borderColor: vars.color.border,
});

// Blockquote refinements
globalStyle(`${portableTextContainer} blockquote`, {
  borderLeft: `3px solid ${vars.color.primaryAlt}55`,
  paddingLeft: '1.5rem',
  marginTop: '3rem',
  marginBottom: '2.75rem',
  fontSize: '1.2rem',
  lineHeight: 1.6,
  color: vars.color.textDim,
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} blockquote`, {
  color: '#D9DEE4',
  borderLeft: `3px solid ${vars.color.primaryAlt}88`,
});

// Images inside content
globalStyle(`${portableTextContainer} img`, {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '1rem',
  margin: '2.5rem auto',
  boxShadow: '0 8px 28px -6px rgba(0,0,0,0.15)',
});

// Figure captions
globalStyle(`${portableTextContainer} figcaption`, {
  fontSize: '.75rem',
  textAlign: 'center',
  marginTop: '.75rem',
  color: vars.color.textDim,
  letterSpacing: '.05em',
});
globalStyle(`[data-theme="dark"] ${portableTextContainer} figcaption`, {
  color: '#B8C2CC',
});

// Tighten bottom spacing for last element
globalStyle(`${portableTextContainer} > :last-child`, {
  marginBottom: '0 !important',
});

export const authorBlock = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '1.25rem',
  marginBottom: '1.25rem',
});

export const authorAvatar = style({
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  overflow: 'hidden',
  flexShrink: 0,
  background: vars.color.accentSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '.05em',
  color: vars.color.textDim,
  border: `1px solid ${vars.color.borderSoft}`,
});

export const authorName = style({
  fontSize: '0.9375rem',
  fontWeight: 500,
  letterSpacing: '0.01em',
  color: vars.color.textDim,
  selectors: {
    '[data-theme="dark"] &': { color: '#E4E9EF' },
  },
});

export const publishedMeta = style({
  marginTop: '3rem',
  fontSize: '0.75rem',
  fontStyle: 'italic',
  letterSpacing: '0.04em',
  color: vars.color.textDim,
  textAlign: 'right',
  opacity: 0.85,
  selectors: {
    '[data-theme="dark"] &': { color: '#B8C2CC' },
  },
});

export const metaBar = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  letterSpacing: '0.03em',
  color: vars.color.textDim,
  marginTop: '1rem',
  marginBottom: '1rem',
  selectors: {
    '[data-theme="dark"] &': { color: '#C9D1D9' },
  },
});

export const metaItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
});

export const metaSeparator = style({
  opacity: 0.5,
});
