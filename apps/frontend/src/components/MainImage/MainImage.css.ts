import { style } from '@vanilla-extract/css';

export const container = style({
  width: '100%',
  overflow: 'hidden',
  maxWidth: '1140px',
  marginBottom: '32px',
});

export const imageStyle = style({
  width: '100%',
  height: 'auto',
  display: 'block',
});

export const missingImage = style({
  width: '100%',
  minHeight: '300px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#E5E7EB',
  color: '#6B7280',
});
