import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const homeContainer = style({
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${vars.color.bg} 0%, ${vars.color.bgAlt} 50%, ${vars.color.bgSoft} 100%)`,
});

export const heroSection = style({
  paddingTop: '7.5rem',
  paddingBottom: '8.5rem',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  maxWidth: '72rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  textAlign: 'center',
  '@media': {
    'screen and (max-width: 768px)': {
      paddingTop: '7rem',
      paddingBottom: '9rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },
});

export const heroContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.5rem',
});

export const heroTitle = style({
  fontSize: '5.5rem',
  fontWeight: 600,
  background: `linear-gradient(135deg, ${vars.color.primary} 0%, ${vars.color.primaryAlt} 50%, ${vars.color.primaryDeep} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.04em',
  marginBottom: '1rem',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '2.75rem',
      letterSpacing: '-0.02em',
    },
  },
});

export const heroSubtitle = style({
  fontSize: '1.875rem',
  fontWeight: 400,
  color: vars.color.textDim,
  marginBottom: '1.5rem',
  letterSpacing: '-0.015em',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.375rem',
    },
  },
});

export const heroDescription = style({
  fontSize: '1.3125rem',
  lineHeight: 1.9,
  color: vars.color.textDim,
  maxWidth: '46rem',
  marginBottom: '2rem',
  letterSpacing: '-0.008em',
  fontWeight: 300,
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.125rem',
    },
  },
});

export const logoContainer = style({
  display: 'flex',
  alignItems: 'center',
  gap: '3rem',
  marginTop: '3rem',
  marginBottom: '5rem',
  '@media': {
    'screen and (max-width: 768px)': {
      gap: '2rem',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
  },
});

export const logo = style({
  height: '40px',
  opacity: 0.85,
  transition: 'opacity 0.3s ease',
  ':hover': {
    opacity: 1,
  },
  '@media': {
    'screen and (max-width: 768px)': {
      height: '36px',
    },
  },
});

export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '2.5rem',
  width: '100%',
  maxWidth: '64rem',
  marginTop: '5rem',
  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '2rem',
      marginTop: '3.5rem',
    },
  },
});

export const featureCard = style({
  background: 'rgba(255, 255, 255, 0.6)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(0, 102, 204, 0.08)',
  borderRadius: '1.25rem',
  padding: '2.1rem',
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 1px 3px rgba(0, 102, 204, 0.04)',
  ':hover': {
    background: 'rgba(255, 255, 255, 0.9)',
    borderColor: 'rgba(0, 102, 204, 0.15)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 102, 204, 0.08)',
  },
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '1.6rem',
    },
  },
});

export const featureIcon = style({
  fontSize: '2.5rem',
  marginBottom: '1.1rem',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '2.25rem',
      marginBottom: '1rem',
    },
  },
});

export const featureTitle = style({
  fontSize: 'clamp(1.05rem, 0.9rem + 0.5vw, 1.25rem)',
  fontWeight: 600,
  color: vars.color.primary,
  marginBottom: '0.55rem',
  letterSpacing: '-0.01em',
});

export const featureDescription = style({
  fontSize: 'clamp(0.85rem, 0.8rem + 0.3vw, 0.95rem)',
  color: vars.color.textDim,
  lineHeight: 1.55,
  letterSpacing: '-0.005em',
  fontWeight: 300,
});

export const divider = style({
  height: '1px',
  background: 'linear-gradient(90deg, transparent 0%, rgba(0, 102, 204, 0.08) 50%, transparent 100%)',
  marginTop: '5rem',
  marginBottom: '4rem',
  maxWidth: '80rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  '@media': {
    'screen and (max-width: 768px)': {
      marginTop: '6rem',
      marginBottom: '4rem',
    },
  },
});

export const section = style({
  paddingTop: '3.75rem',
  paddingBottom: '3.75rem',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  maxWidth: '80rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  '@media': {
    'screen and (max-width: 768px)': {
      paddingTop: '4rem',
      paddingBottom: '4rem',
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },
});

export const sectionTitle = style({
  color: vars.color.primary,
  fontSize: '2.75rem',
  fontWeight: 600,
  marginBottom: '2.5rem',
  textAlign: 'center',
  letterSpacing: '-0.025em',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '2.125rem',
      marginBottom: '3rem',
    },
  },
});

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
  gap: '2rem',
  '@media': {
    'screen and (min-width: 768px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '2.5rem' },
    'screen and (min-width: 1024px)': { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '3rem' },
  },
});

export const loadMoreButton = style({
  marginTop: '3rem',
  padding: '1.125rem 3rem',
  fontSize: '1.0625rem',
  fontWeight: 500,
  color: '#0066cc',
  background: 'rgba(0, 102, 204, 0.04)',
  backdropFilter: 'blur(10px)',
  border: '1.5px solid rgba(0, 102, 204, 0.12)',
  borderRadius: '624px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ':hover': {
    background: 'rgba(0, 102, 204, 0.08)',
    borderColor: 'rgba(0, 102, 204, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 102, 204, 0.1)',
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  gridColumn: '1 / -1',
  justifySelf: 'center',
});

// New sections
export const subtleHeading = style({
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  fontWeight: 600,
  color: 'rgba(0,0,0,0.45)',
  marginBottom: '1.25rem',
});

export const highlightsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))',
  gap: '1.5rem',
  width: '100%',
  marginTop: '1rem',
});

export const highlightCard = style({
  background: 'rgba(255,255,255,0.55)',
  border: '1px solid rgba(0,102,204,0.08)',
  borderRadius: '1rem',
  padding: '1.25rem 1.35rem 1.3rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '.5rem',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(12px)',
  selectors: { '&:hover': { background: 'rgba(255,255,255,0.85)' } },
});

export const highlightIcon = style({
  fontSize: '1.35rem',
  lineHeight: 1,
});

export const highlightTitle = style({
  fontSize: '0.95rem',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: vars.color.primaryDeep,
});

export const highlightText = style({
  fontSize: '0.8rem',
  lineHeight: 1.5,
  color: vars.color.textDim,
});

export const wideSection = style({
  maxWidth: '80rem',
  margin: '0 auto',
  padding: '0 2rem',
  '@media': { 'screen and (max-width: 768px)': { padding: '0 1.5rem' } },
});

export const twoCol = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
  gap: '2.25rem',
  alignItems: 'start',
});

export const paragraph = style({
  fontSize: '1rem',
  lineHeight: 1.7,
  color: 'rgba(0,0,0,0.7)',
  letterSpacing: '-0.005em',
});

export const callout = style({
  background: 'linear-gradient(135deg, rgba(0,102,204,0.08), rgba(0,102,204,0.02))',
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: '1rem',
  padding: '1.5rem 1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
});

export const codeBlock = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '0.8rem',
  lineHeight: 1.6,
  background: 'rgba(0,0,0,0.04)',
  border: '1px solid rgba(0,0,0,0.08)',
  padding: '1rem 1.25rem',
  borderRadius: '0.75rem',
  overflowX: 'auto',
});

export const miniBadgeRow = style({
  display: 'flex',
  gap: '.5rem',
  flexWrap: 'wrap',
});

export const miniBadge = style({
  fontSize: '0.65rem',
  padding: '.35rem .6rem',
  borderRadius: '624px',
  background: 'rgba(0,102,204,0.08)',
  color: '#005bb5',
  fontWeight: 500,
  letterSpacing: '.05em',
});

// Reveal animation utilities
export const reveal = style({
  opacity: 0,
  transform: 'translateY(24px)',
  transition: 'opacity .8s ease, transform .8s cubic-bezier(.4,0,.2,1)',
  selectors: {
    '&.in': { opacity: 1, transform: 'translateY(0)' },
    '&[data-theme="dark"]&': { },
  },
});
