import { globalStyle, style } from '@vanilla-extract/css';

export const postCard = style({
  display: 'block',
  textDecoration: 'none',
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(0, 102, 204, 0.08)',
  borderRadius: '1.15rem',
  padding: '0',
  overflow: 'hidden',
  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 1px 3px rgba(0, 102, 204, 0.04)',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(0, 102, 204, 0.15)',
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 34px rgba(0, 102, 204, 0.10)',
  },
});

export const imageContainer = style({
  position: 'relative',
  width: '100%',
  paddingBottom: '66.67%', // 3:2 aspect ratio
  overflow: 'hidden',
  backgroundColor: 'rgba(0, 102, 204, 0.03)',
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
  backgroundColor: 'rgba(0, 102, 204, 0.03)',
  color: 'rgba(0, 102, 204, 0.25)',
  fontSize: '4rem',
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
  color: '#0066cc',
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
  color: 'rgba(29, 29, 31, 0.65)',
  lineHeight: 1.8,
  fontSize: '1.0625rem',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  letterSpacing: '-0.008em',
  fontWeight: 300,
});
