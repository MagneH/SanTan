import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const wrapper = style({
  width: '100%',
  maxWidth: '72rem',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
  gap: '1rem',
  alignItems: 'stretch',
  gridAutoRows: '1fr',
  '@media': {
    'screen and (min-width: 640px)': { gap: '1.25rem' },
    'screen and (min-width: 960px)': { gap: '1.5rem' },
  },
});

export const card = style({
  listStyle: 'none',
  display: 'flex',
});

export const link = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '.55rem',
  textDecoration: 'none',
  padding: '1rem 1rem .95rem',
  borderRadius: '1rem',
  background: vars.color.surfaceElevated,
  border: `1px solid ${vars.color.borderSoft}`,
  minHeight: '120px',
  position: 'relative',
  transition: 'background .3s, border-color .3s, transform .35s, box-shadow .35s',
  height: '100%',
  flex: 1,
  selectors: {
    '&:hover': { background: vars.color.surfaceHover, borderColor: vars.color.border, transform: 'translateY(-4px)', boxShadow: vars.shadow.float },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const emoji = style({
  fontSize: '1.5rem',
  lineHeight: 1,
});

export const title = style({
  fontSize: '.95rem',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: vars.color.text,
  lineHeight: 1.15,
});

export const desc = style({
  fontSize: '.7rem',
  lineHeight: 1.4,
  color: vars.color.textDim,
  maxWidth: '30ch',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

export const headerRow = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '1rem',
});

export const heading = style({
  fontSize: '1.15rem',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  margin: 0,
  color: vars.color.text,
  selectors: {
    '[data-theme="dark"] &': { color: '#F5F9FC' },
  },
});

export const allLink = style({
  fontSize: '.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  textDecoration: 'none',
  fontWeight: 600,
  color: vars.color.primary,
  padding: '.4rem .7rem',
  borderRadius: '624px',
  background: vars.color.accentSoft,
  border: `1px solid ${vars.color.borderSoft}`,
  transition: 'background .3s, border-color .3s, color .3s',
  selectors: {
    '&:hover': { background: vars.color.accentTint, borderColor: vars.color.border },
    '[data-theme="dark"] &': { background: 'rgba(255,255,255,0.07)', color: '#F5F9FC' },
    '[data-theme="dark"] &:hover': { background: 'rgba(255,255,255,0.12)', color: vars.color.primary },
  },
});

export const emptyState = style({
  fontSize: '.85rem',
  color: vars.color.textDim,
  textAlign: 'center',
  padding: '2rem 0',
});
