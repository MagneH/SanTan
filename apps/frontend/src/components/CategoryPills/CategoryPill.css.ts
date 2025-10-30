import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const pillListWrapper = style({
  width: '100%',
  maxWidth: '72rem',
  margin: '0 auto',
});

export const pillScroller = style({
  display: 'flex',
  gap: '0.75rem',
  padding: '0.25rem 0.25rem 0.5rem',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  overscrollBehaviorX: 'contain',
  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
  },
  '@media': {
    'screen and (min-width: 860px)': {
      flexWrap: 'wrap',
      overflowX: 'visible',
      padding: 0,
    },
  },
});

export const pill = style({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '.55rem',
  textDecoration: 'none',
  background: vars.color.accentSoft,
  padding: '.75rem 1.1rem .7rem',
  borderRadius: '9999px',
  fontSize: '0.85rem',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  color: vars.color.primaryDeep,
  lineHeight: 1.1,
  border: `1px solid ${vars.color.borderSoft}`,
  transition: 'background .25s, border-color .25s, transform .25s',
  selectors: {
    '&:hover': {
      background: vars.color.accentTint,
      borderColor: vars.color.border,
      transform: 'translateY(-2px)',
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: vars.shadow.focus,
    },
    '&[data-active="true"]': {
      zIndex: 50,
      background: vars.color.accentTint,
      borderColor: vars.color.border,
      boxShadow: vars.shadow.subtle,
    },
  },
});

export const pillAnimated = style({
  opacity: 0,
  transform: 'translateY(8px)',
  transition: 'opacity .5s ease, transform .55s cubic-bezier(.4,0,.2,1)',
});

export const pillIn = style({
  opacity: 1,
  transform: 'translateY(0)',
});

export const pillEmoji = style({
  fontSize: '1rem',
  lineHeight: 1,
});

export const pillTitle = style({
  whiteSpace: 'nowrap',
  maxWidth: '16ch',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const pillDescription = style({
  position: 'absolute',
  left: 0,
  top: 'calc(100% + 8px)',
  zIndex: 20,
  minWidth: '220px',
  maxWidth: '260px',
  background: vars.color.bgAlt,
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: vars.radius.md,
  padding: '0.85rem 0.95rem',
  fontSize: '0.7rem',
  lineHeight: 1.4,
  letterSpacing: '.02em',
  color: vars.color.textDim,
  boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
  opacity: 0,
  transform: 'translateY(-2px) scale(.98)',
  pointerEvents: 'none',
  selectors: {
    [`${pill}[data-active="true"] &`]: { opacity: 1, transform: 'translateY(0) scale(1)', pointerEvents: 'auto' },
    '[data-theme="dark"] &': {
      background: 'rgba(25,30,35,0.97)',
      boxShadow: '0 8px 28px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
      color: vars.color.textDim,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-6px',
      left: '50%',
      width: '12px',
      height: '12px',
      background: 'inherit',
      borderLeft: `1px solid ${vars.color.borderSoft}`,
      borderTop: `1px solid ${vars.color.borderSoft}`,
      transform: 'translateX(-50%) rotate(45deg)',
      borderTopLeftRadius: '2px',
      boxShadow: 'inherit',
      zIndex: -1,
    },
  },
});

export const pillGridFallback = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
  gap: '0.85rem',
  width: '100%',
  '@media': {
    'screen and (max-width: 859px)': {
      display: 'none',
    },
  },
});
