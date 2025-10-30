import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const ctaOuter = style({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: '3.5rem 2rem',
});

export const ctaInner = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  background: `linear-gradient(135deg, ${vars.color.accentTint}, ${vars.color.accentSoft})`,
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: vars.radius.lg,
  padding: '2.75rem clamp(1.5rem,3vw,3rem)',
  boxShadow: vars.shadow.subtle,
  '@media': { 'screen and (min-width: 860px)': { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } },
});

export const ctaTitle = style({
  fontSize: '2rem',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  margin: 0,
  color: vars.color.primaryDeep,
});

export const ctaText = style({
  margin: '0.75rem 0 0',
  maxWidth: '40ch',
  lineHeight: 1.6,
  color: vars.color.textDim,
  fontSize: '1rem',
});

export const ctaActions = style({
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
});

const baseBtn = {
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '3rem',
  padding: '0 1.5rem',
  fontSize: '0.95rem',
  fontWeight: 500,
  borderRadius: vars.radius.pill,
  transition: 'background .3s, color .3s, border-color .3s, box-shadow .3s',
  cursor: 'pointer',
};

export const ctaPrimary = style({
  ...baseBtn,
  background: `linear-gradient(90deg, ${vars.color.primary}, ${vars.color.primaryDeep})`,
  color: '#fff',
  border: 'none',
  selectors: { '&:hover': { filter: 'brightness(1.05)' }, '&:active': { filter: 'brightness(.92)' }, '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus } },
});

export const ctaSecondary = style({
  ...baseBtn,
  background: vars.color.accentSoft,
  color: vars.color.primaryDeep,
  border: `1px solid ${vars.color.borderSoft}`,
  selectors: { '&:hover': { background: vars.color.accentTint }, '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus } },
});

