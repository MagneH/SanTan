import { createTheme, createThemeContract } from '@vanilla-extract/css';

// Define the theme contract (structure)
const themeContract = createThemeContract({
  color: {
    bg: null,
    bgAlt: null,
    bgSoft: null,
    text: null,
    textDim: null,
    border: null,
    borderSoft: null,
    primary: null,
    primaryAlt: null,
    primaryDeep: null,
    accentTint: null,
    accentSoft: null,
    codeBg: null,
    overlay: null,
    glass: null,
    // Added higher-contrast tokens
    surfaceElevated: null,
    surfaceHover: null,
    interactiveBg: null,
    interactiveBgHover: null,
    danger: null,
    warning: null,
    success: null
  },
  radius: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    pill: null
  },
  shadow: {
    subtle: null,
    float: null,
    focus: null
  },
  space: {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    8: null,
    10: null,
    12: null
  },
  font: {
    mono: null
  }
});

// Light theme (default)
export const lightTheme = createTheme(themeContract, {
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
    glass: 'rgba(255,255,255,0.65)',
    // New tokens light
    surfaceElevated: '#ffffff',
    surfaceHover: '#f9fbfd',
    interactiveBg: '#0066cc',
    interactiveBgHover: '#005bb5',
    danger: '#d92f2f',
    warning: '#e6a700',
    success: '#178544'
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

// Dark theme
export const darkTheme = createTheme(themeContract, {
  color: {
    bg: '#0B1A2A',              // Marineblå grunnbakgrunn
    bgAlt: '#112B42',           // Løftet panelbakgrunn
    bgSoft: '#15354D',          // Myk seksjonsbakgrunn
    text: '#F5F9FC',            // Nesten helt hvit tekst for optimal lesbarhet
    textDim: '#C2D4E2',         // Dempet tekst (metadata)
    border: '#2F5470',          // Kontrastkant
    borderSoft: '#1E3A52',      // Mykere kant
    primary: '#4DB8FF',         // Hovedaksent (lys azur på mørk blå)
    primaryAlt: '#33A4F0',      // Mellomtonelys
    primaryDeep: '#1E6FB8',     // Dyp aksent
    accentTint: 'rgba(77,184,255,0.18)', // Subtil aksent bakgrunn (hover/etiketter)
    accentSoft: 'rgba(77,184,255,0.10)', // Ekstra svak bakgrunn
    codeBg: '#102638',          // Kodeblokkbakgrunn
    overlay: 'rgba(0,0,0,0.55)',
    glass: 'rgba(17,43,66,0.64)',
    surfaceElevated: '#142F45', // Kort / løftede flater
    surfaceHover: '#1A3A53',    // Hover over løftede flater
    interactiveBg: '#1E6FB8',   // Primær interaktiv
    interactiveBgHover: '#2480D1', // Hover for interaktiv
    danger: '#FF5F5F',
    warning: '#FFC94D',
    success: '#2FB573'
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
    subtle: '0 1px 2px rgba(0,0,0,0.55)',
    float: '0 8px 32px rgba(0,0,0,0.6)',
    focus: '0 0 0 3px rgba(77,184,255,0.45)'
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

// Export the contract as vars for use in components
export const vars = themeContract;
