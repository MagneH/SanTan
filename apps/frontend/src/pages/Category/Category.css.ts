import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh',
  background: `linear-gradient(180deg, ${vars.color.bg} 0%, ${vars.color.bgAlt} 50%, ${vars.color.bgSoft} 100%)`,
  paddingTop: '8rem',
  paddingBottom: '10rem',
});

export const textContainer = style({
  maxWidth: '50rem',
  width: '100%',
  paddingLeft: '2.5rem',
  paddingRight: '2.5rem',
  '@media': {
    'screen and (max-width: 768px)': {
      paddingLeft: '1.5rem',
      paddingRight: '1.5rem',
    },
  },
});

export const ingress = style({
  maxWidth: '42rem',
  fontSize: '1.5rem',
  fontWeight: 300,
  lineHeight: 1.9,
  color: vars.color.textDim,
  marginBottom: '5rem',
  marginTop: '2.5rem',
  letterSpacing: '-0.015em',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.25rem',
      marginBottom: '4rem',
    },
  },
});

export const keywordsSection = style({
  marginTop: '5rem',
  padding: '3rem',
  background: vars.color.glass,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: '2rem',
  boxShadow: vars.shadow.subtle,
  '@media': {
    'screen and (max-width: 768px)': {
      padding: '2rem',
    },
  },
});

export const keywordsTitle = style({
  fontSize: '1.875rem',
  fontWeight: 600,
  color: vars.color.primary,
  marginBottom: '2.5rem',
  letterSpacing: '-0.015em',
});

export const keywordsList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.25rem',
  listStyle: 'none',
  padding: 0,
  margin: 0,
});

export const keywordItem = style({
  padding: '0.875rem 1.75rem',
  background: vars.color.accentSoft,
  border: `1.5px solid ${vars.color.borderSoft}`,
  borderRadius: '624px',
  color: vars.color.primary,
  fontSize: '1.0625rem',
  fontWeight: 500,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ':hover': {
    background: vars.color.accentTint,
    borderColor: vars.color.border,
    transform: 'translateY(-2px)',
    boxShadow: '0 2px 8px rgba(0, 102, 204, 0.08)',
  },
});

export const portableTextContainer = style({
  width: '100%',
  maxWidth: '42rem',
  display: 'flex',
  flexDirection: 'column',
});

globalStyle(`${portableTextContainer} > *:not(p)`, {
  marginTop: '1.5rem',
  marginBottom: '1rem',
  fontWeight: 400,
  lineHeight: 1.25,
  color: vars.color.primary,
});

globalStyle(`${portableTextContainer} p`, {
  color: vars.color.textDim,
  lineHeight: 1.7,
});
