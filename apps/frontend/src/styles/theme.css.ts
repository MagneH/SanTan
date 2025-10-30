import { createGlobalTheme } from '@vanilla-extract/css';

// Base (light) theme tokens
export const vars = createGlobalTheme(':root', {
  color: {
    bg: '#f5f7fa',
    bgAlt: '#ffffff',
    bgSoft: '#f0f4f8',
    text: 'rgba(29,29,31,0.82)',
    textDim: 'rgba(29,29,31,0.6)',
    border: 'rgba(0,102,204,0.12)',
    borderSoft: 'rgba(0,102,204,0.08)',
    primary: '#0066cc',
    primaryAlt: '#005bb5',
    primaryDeep: '#00447d',
    accentTint: 'rgba(0,102,204,0.06)',
    accentSoft: 'rgba(0,102,204,0.04)',
    codeBg: 'rgba(0,0,0,0.04)',
    overlay: 'rgba(0,0,0,0.25)',
    glass: 'rgba(255,255,255,0.65)'
  },
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '32px',
    pill: '624px'
  },
  shadow: {
    subtle: '0 1px 2px rgba(0,0,0,0.06)',
    float: '0 8px 24px rgba(0,0,0,0.08)',
    focus: '0 0 0 3px rgba(0,102,204,0.35)'
  },
  space: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem'
  },
  font: {
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
  }
});

// Dark theme overrides
createGlobalTheme('[data-theme="dark"]', {
  color: {
    bg: '#0f1214',
    bgAlt: '#151a1f',
    bgSoft: '#1b2229',
    text: 'rgba(255,255,255,0.92)',
    textDim: 'rgba(255,255,255,0.65)',
    border: 'rgba(120,180,255,0.25)',
    borderSoft: 'rgba(120,180,255,0.12)',
    primary: '#66b3ff',
    primaryAlt: '#4d9ee8',
    primaryDeep: '#1e74c7',
    accentTint: 'rgba(120,180,255,0.12)',
    accentSoft: 'rgba(120,180,255,0.08)',
    codeBg: 'rgba(255,255,255,0.08)',
    overlay: 'rgba(0,0,0,0.5)',
    glass: 'rgba(25,30,35,0.6)'
  },
  radius: vars.radius,
  shadow: {
    subtle: '0 1px 2px rgba(0,0,0,0.6)',
    float: '0 8px 32px rgba(0,0,0,0.55)',
    focus: '0 0 0 3px rgba(102,179,255,0.4)'
  },
  space: vars.space,
  font: vars.font
});

