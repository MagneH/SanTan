import { style } from '@vanilla-extract/css';

export const homeContainer = style({
  minHeight: '100vh',
  background: 'linear-gradient(to bottom, #0f172a, #1e293b, #0f172a)',
});

export const section = style({
  paddingTop: '4rem',
  paddingBottom: '4rem',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  maxWidth: '80rem',
  marginLeft: 'auto',
  marginRight: 'auto',
});

export const sectionTitle = style({
  color: '#ffffff',
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '2rem',
});

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: '1.5rem',
  '@media': {
    'screen and (min-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    'screen and (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    },
  },
});

export const loadMoreButton = style({
  marginTop: '1.5rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#ffffff',
  backgroundColor: 'rgba(6, 182, 212, 0.5)',
  border: 'none',
  borderRadius: '0.375rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  ':hover': {
    backgroundColor: 'rgba(6, 182, 212, 0.7)',
  },
  gridColumn: '1 / -1',
});
