import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 200px)',
  padding: '2rem',
  textAlign: 'center',
});

export const title = style({
  fontSize: '6rem',
  fontWeight: 700,
  color: vars.color.primary,
  marginBottom: '1rem',
  letterSpacing: '-0.03em',
});

export const description = style({
  fontSize: '1.5rem',
  color: vars.color.textDim,
  marginBottom: '2rem',
  maxWidth: '46rem',
  lineHeight: 1.6,
});

export const buttonContainer = style({
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

const baseBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  borderRadius: vars.radius.md,
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background .25s, color .25s, box-shadow .25s',
};

export const buttonPrimary = style({
  ...baseBtn,
  background: vars.color.interactiveBg,
  color: '#fff',
  boxShadow: vars.shadow.subtle,
  selectors: {
    '&:hover': { background: vars.color.interactiveBgHover },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const buttonGhost = style({
  ...baseBtn,
  background: 'transparent',
  color: vars.color.primary,
  border: `1px solid ${vars.color.borderSoft}`,
  selectors: {
    '&:hover': { background: vars.color.accentSoft },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});
