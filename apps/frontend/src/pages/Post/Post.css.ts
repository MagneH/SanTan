import { globalStyle, style } from '@vanilla-extract/css';

export const portableTextContainer = style({
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
});

globalStyle(`${portableTextContainer} > *:not( p )`, {
  marginTop: '1.5rem',
  marginBottom: '1rem',
  fontWeight: 400,
  lineHeight: 1.25,
});

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#f7fafc',
});

export const textContainer = style({
  maxWidth: '1140px',
});

export const ingress = style({
  maxWidth: '800px',
  // Style for ingress text, italic, light font weight, larger text, margin bottom
  fontStyle: 'italic',
  fontWeight: 300,
  fontSize: '1.25rem',
  marginBottom: '1.5rem',
});

// flex flex-col items-start gap-4 lg:flex-row lg:gap-12
