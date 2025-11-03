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

export const aspectWrapper = style({
  position: 'relative',
  width: '100%',
  paddingBottom: '56.25%' /* 16:9 default ratio fallback */,
  overflow: 'hidden',
  background: vars.color.bgSoft,
  selectors: {
    '[data-theme="dark"] &': { background: vars.color.surfaceElevated },
  },
});

export const imgActual = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

export const skeleton = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(90deg, ${vars.color.bgSoft} 0%, ${vars.color.bgAlt} 50%, ${vars.color.bgSoft} 100%)`,
  animation: 'pulse 1.6s ease-in-out infinite',
  opacity: 0.6,
  selectors: {
    '[data-theme="dark"] &': {
      background: `linear-gradient(90deg, ${vars.color.surfaceElevated} 0%, ${vars.color.bgAlt} 50%, ${vars.color.surfaceElevated} 100%)`,
    },
  },
});

export const portraitWrapper = style({
  position: 'relative',
  width: '100%',
  maxWidth: '1140px',
  height: '60vh',
  minHeight: '400px',
  overflow: 'hidden',
  background: vars.color.bgSoft,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '[data-theme="dark"] &': { background: vars.color.surfaceElevated },
  },
});

export const portraitImg = style({
  maxHeight: '100%',
  height: '100%',
  width: 'auto',
  objectFit: 'contain',
  display: 'block',
});

export const placeholderWrapper = style({
  position: 'relative',
  width: '100%',
  paddingBottom: '56.25%', // 16:9
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${vars.color.bgSoft} 0%, ${vars.color.bgAlt} 100%)`,
  color: vars.color.textDim,
  overflow: 'hidden',
  border: `1px dashed ${vars.color.borderSoft}`,
  selectors: {
    '[data-theme="dark"] &': {
      background: `linear-gradient(135deg, ${vars.color.surfaceElevated} 0%, ${vars.color.bgAlt} 100%)`,
      color: '#B8C2CC',
      border: `1px dashed ${vars.color.border}`,
    },
  },
});

export const placeholderInner = style({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.75rem',
  fontSize: '0.75rem',
  letterSpacing: '0.08em',
  fontWeight: 600,
  textTransform: 'uppercase',
  userSelect: 'none',
  opacity: 0.85,
});
