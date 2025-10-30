import { style } from '@vanilla-extract/css';

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
  color: '#0f172a',
  marginBottom: '1rem',
});

export const description = style({
  fontSize: '1.5rem',
  color: '#64748b',
  marginBottom: '2rem',
});

export const buttonContainer = style({
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  justifyContent: 'center',
});

export const button = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'white',
  backgroundColor: '#0ea5e9',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: '#0284c7',
  },
});
