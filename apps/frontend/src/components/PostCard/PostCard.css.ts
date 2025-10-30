import { globalStyle, style } from '@vanilla-extract/css';

export const postCard = style({
  display: 'block',
  textDecoration: 'none',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(100, 116, 139, 1)',
  borderRadius: '1rem',
  padding: '1.5rem',
  overflow: 'hidden',
  ':hover': {
    borderColor: 'rgba(6, 182, 212, 0.5)',
    boxShadow: '0 10px 15px -3px rgba(6, 182, 212, 0.1), 0 4px 6px -2px rgba(6, 182, 212, 0.05)',
    transform: 'translateY(-2px)',
  },
});

export const imageContainer = style({
  position: 'relative',
  width: '100%',
  paddingBottom: '100%', // Creates a square aspect ratio (1:1)
  overflow: 'hidden',
  backgroundColor: '#F9FAFB',
  marginBottom: '1rem',
});

export const image = style({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
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
  backgroundColor: '#E5E7EB',
  color: '#6B7280',
});

// Apply hover effect to images inside postCard
globalStyle(`${postCard}:hover img`, {
  transform: 'scale(1.04)',
});

export const postCardTitle = style({
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'white',
  marginBottom: '0.75rem',
});

export const postCardIngress = style({
  color: 'rgba(156, 163, 175, 1)',
  lineHeight: 1.625,
});
