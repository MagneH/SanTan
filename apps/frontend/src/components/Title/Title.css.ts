import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const title = style({
  fontSize: '3.5rem',
  fontWeight: 600,
  marginBottom: '1.5rem',
  color: vars.color.primary,
  textAlign: 'start',
  letterSpacing: '-0.03em',
  lineHeight: 1.2,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '2.5rem',
    },
  },
});

