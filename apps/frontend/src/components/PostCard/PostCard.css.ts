import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const postCard = style({
  display: 'block',
  textDecoration: 'none',
  background: vars.color.surfaceElevated,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: '1.15rem',
  padding: '0',
  overflow: 'hidden',
  transition: 'background .25s, transform .35s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: vars.shadow.subtle,
  ':hover': {
    background: vars.color.surfaceHover,
    borderColor: vars.color.border,
    transform: 'translateY(-5px)',
    boxShadow: vars.shadow.float,
  },
});

export const imageContainer = style({
  position: 'relative',
  width: '100%',
  paddingBottom: '66.67%', // 3:2 aspect ratio
  overflow: 'hidden',
  backgroundColor: vars.color.accentSoft,
});

export const image = style({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
});

export const missingImage = style({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: vars.color.accentSoft,
  color: vars.color.borderSoft,
  fontSize: '4rem',
  selectors: {
    '[data-theme="dark"] &': {
      backgroundColor: vars.color.surfaceElevated,
      color: '#2F5470',
    },
  },
});

globalStyle(`${postCard}:hover img`, {
  transform: 'scale(1.06)',
});

export const postCardContent = style({
  padding: '2rem',
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '1.5rem',
    },
  },
});

export const postCardTitle = style({
  fontSize: '1.625rem',
  fontWeight: 600,
  color: vars.color.primary,
  marginBottom: '1.25rem',
  lineHeight: 1.35,
  letterSpacing: '-0.02em',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
});

export const postCardIngress = style({
  color: vars.color.textDim,
  lineHeight: 1.7,
  fontSize: '1.02rem',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  letterSpacing: '-0.008em',
  fontWeight: 300,
});

globalStyle(`${postCardContent} h1, ${postCardContent} h2, ${postCardContent} h3`, {
  color: vars.color.text,
  lineHeight: 1.25,
  letterSpacing: '-0.015em',
  fontWeight: 600,
});

globalStyle(`${postCardContent} h1`, { fontSize: 'clamp(1.6rem, 1.3rem + 1vw, 2.1rem)' });
globalStyle(`${postCardContent} h2`, { fontSize: 'clamp(1.35rem, 1.15rem + .7vw, 1.75rem)' });
globalStyle(`${postCardContent} h3`, { fontSize: 'clamp(1.15rem, 1rem + .5vw, 1.45rem)', fontWeight: 600 });

globalStyle(`${postCardContent} h1, ${postCardContent} h2, ${postCardContent} h3`, {
  transition: 'color .25s',
});

globalStyle(`${postCardContent} h1:hover, ${postCardContent} h2:hover, ${postCardContent} h3:hover`, {
  color: vars.color.primaryAlt,
});
