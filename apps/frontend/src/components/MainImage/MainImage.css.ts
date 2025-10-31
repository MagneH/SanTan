import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

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
  backgroundColor: vars.color.bgSoft,
  color: vars.color.textDim,
  selectors: {
    '[data-theme="dark"] &': {
      backgroundColor: vars.color.surfaceElevated,
      color: '#C2D4E2',
    },
  },
});
