import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const footer = style({
  marginTop: '6rem',
  borderTop: `1px solid ${vars.color.borderSoft}`,
  background: vars.color.surfaceElevated,
  backdropFilter: 'blur(18px) saturate(160%)',
  WebkitBackdropFilter: 'blur(18px) saturate(160%)',
  padding: '3.5rem clamp(1.5rem,3vw,3rem)',
  display: 'flex',
  flexDirection: 'column',
  gap: '2.5rem',
  transition: 'background .25s',
  '@media': {
    'screen and (min-width: 900px)': {
      gap: '3rem',
    },
  },
});

export const topRow = style({
  display: 'grid',
  gap: '2rem',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
});

export const brandBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '.85rem',
  maxWidth: '34ch',
});

export const brandName = style({
  fontSize: '1.1rem',
  fontWeight: 600,
  letterSpacing: '-0.02em',
  background: `linear-gradient(135deg, ${vars.color.primary}, ${vars.color.primaryDeep})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
});

export const brandTagline = style({
  fontSize: '.8rem',
  lineHeight: 1.5,
  color: vars.color.textDim,
  letterSpacing: '.02em',
});

export const linkGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '.55rem',
  fontSize: '.8rem',
});

export const groupTitle = style({
  fontSize: '.72rem',
  textTransform: 'uppercase',
  letterSpacing: '.16em',
  fontWeight: 600,
  color: vars.color.textDim,
});

export const footerLink = style({
  color: vars.color.primaryDeep,
  textDecoration: 'none',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  transition: 'color .25s, background .25s',
  padding: '.35rem .5rem',
  borderRadius: vars.radius.sm,
  selectors: {
    '&:hover': { color: vars.color.primary, background: vars.color.accentTint },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});

export const bottomRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  paddingTop: '1.5rem',
  borderTop: `1px solid ${vars.color.borderSoft}`,
  fontSize: '.7rem',
  letterSpacing: '.03em',
  color: vars.color.textDim,
  '@media': {
    'screen and (min-width: 700px)': { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  },
});

export const smallMeta = style({
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const metaItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.4rem',
});

export const heart = style({
  color: vars.color.primary,
});
