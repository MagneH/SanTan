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
  fontStyle: 'italic',
  letterSpacing: '-0.015em',
  '@media': {
    'screen and (max-width: 768px)': {
      fontSize: '1.25rem',
      marginBottom: '4rem',
    },
  },
});

export const portableTextContainer = style({
  width: '100%',
  maxWidth: '42rem',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '3.5rem',
});

globalStyle(`${portableTextContainer} > *:not(p)`, {
  marginTop: '3.5rem',
  marginBottom: '1.75rem',
  fontWeight: 600,
  lineHeight: 1.35,
  color: vars.color.primary,
  letterSpacing: '-0.02em',
});

globalStyle(`${portableTextContainer} h2`, {
  fontSize: '2.125rem',
  marginTop: '4.5rem',
  marginBottom: '1.75rem',
});

globalStyle(`${portableTextContainer} h3`, {
  fontSize: '1.75rem',
  marginTop: '4rem',
  marginBottom: '1.5rem',
});

globalStyle(`${portableTextContainer} h4`, {
  fontSize: '1.5rem',
  marginTop: '3.5rem',
  marginBottom: '1.25rem',
});

globalStyle(`${portableTextContainer} p`, {
  color: vars.color.textDim,
  lineHeight: 2,
  fontSize: '1.1875rem',
  marginBottom: '2rem',
  letterSpacing: '-0.008em',
  fontWeight: 300,
});

globalStyle(`${portableTextContainer} a`, {
  color: vars.color.primary,
  textDecoration: 'none',
  borderBottom: `1.5px solid ${vars.color.borderSoft}`,
  transition: 'all 0.2s ease',
});

globalStyle(`${portableTextContainer} a:hover`, {
  color: vars.color.primaryAlt,
  borderBottomColor: vars.color.primaryAlt,
});

globalStyle(`${portableTextContainer} ul, ${portableTextContainer} ol`, {
  color: vars.color.textDim,
  lineHeight: 2,
  fontSize: '1.1875rem',
  marginBottom: '2.5rem',
  marginTop: '2rem',
  paddingLeft: '2.5rem',
});

globalStyle(`${portableTextContainer} li`, {
  marginBottom: '1rem',
});

globalStyle(`${portableTextContainer} code`, {
  background: vars.color.accentTint,
  padding: '0.4rem 0.75rem',
  borderRadius: '0.625rem',
  fontSize: '1.0625rem',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  color: vars.color.primary,
});

globalStyle(`${portableTextContainer} pre`, {
  background: vars.color.accentSoft,
  border: `1px solid ${vars.color.borderSoft}`,
  borderRadius: '1.25rem',
  padding: '2.5rem',
  overflow: 'auto',
  marginTop: '3rem',
  marginBottom: '3rem',
});

globalStyle(`${portableTextContainer} blockquote`, {
  borderLeft: `4px solid ${vars.color.primaryAlt}66`,
  paddingLeft: '2.5rem',
  marginLeft: '0',
  fontStyle: 'italic',
  color: vars.color.textDim,
  marginTop: '3.5rem',
  marginBottom: '3.5rem',
  fontSize: '1.375rem',
  lineHeight: 1.9,
  fontWeight: 300,
});
