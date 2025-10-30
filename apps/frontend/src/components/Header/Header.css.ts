import { style } from '@vanilla-extract/css';
import { vars } from '@/styles/theme.css.ts';

export const header = style({
  position: 'sticky',
  top: 0,
  insetInline: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2rem',
  height: '70px',
  padding: '0 2.25rem',
  background: vars.color.glass,
  borderBottom: `1px solid ${vars.color.borderSoft}`,
  boxShadow: `${vars.shadow.subtle}, 0 0 0 0.5px rgba(255,255,255,0.4) inset`,
});

export const brand = style({
  fontSize: '1.35rem',
  fontWeight: 600,
  letterSpacing: '-0.03em',
  background: `linear-gradient(135deg,${vars.color.primary},${vars.color.primaryDeep})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textDecoration: 'none',
  selectors: {
    '&:hover': { opacity: 0.9 },
  },
});

export const desktopNav = style({
  display: 'none',
  alignItems: 'center',
  gap: '2.25rem',
  fontSize: '0.95rem',
  '@media': {
    'screen and (min-width: 840px)': { display: 'flex' },
  },
});

export const navLink = style({
  position: 'relative',
  color: 'rgba(29,29,31,0.75)',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  textDecoration: 'none',
  transition: 'color .25s ease',
  selectors: {
    '&:hover': { color: '#0066cc' },
  },
});

export const navLinkActive = style([
  navLink,
  {
    color: '#0066cc',
    selectors: {
      '&::after': {
        content: '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '-6px',
        height: '2px',
        borderRadius: '2px',
        background: 'linear-gradient(90deg,#0066cc,#004c99)',
      },
    },
  },
]);

export const spacer = style({ flex: 1 });

export const mobileMenuButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: '12px',
  border: '1px solid rgba(0,102,204,0.15)',
  background: 'rgba(255,255,255,0.55)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  cursor: 'pointer',
  color: '#004c99',
  transition: 'all .3s ease',
  selectors: {
    '&:hover': { background: 'rgba(255,255,255,0.8)' },
    '&:active': { transform: 'scale(.94)' },
  },
  '@media': {
    'screen and (min-width: 840px)': { display: 'none' },
  },
});

export const mobilePanel = style({
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 'min(320px,85vw)',
  background: 'rgba(255,255,255,0.72)',
  backdropFilter: 'blur(28px) saturate(180%)',
  WebkitBackdropFilter: 'blur(28px) saturate(180%)',
  borderLeft: '1px solid rgba(0,102,204,0.08)',
  boxShadow: '-8px 0 24px -8px rgba(0,0,0,0.08)',
  padding: '1.5rem 1.75rem 2.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  transform: 'translateX(0)',
  transition: 'transform .4s cubic-bezier(.4,0,.2,1)',
  zIndex: 200,
});

export const mobilePanelHidden = style([
  mobilePanel,
  { transform: 'translateX(100%)' },
]);

export const mobilePanelHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
});

export const closeButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  borderRadius: '50%',
  border: '1px solid rgba(0,102,204,0.15)',
  background: 'rgba(255,255,255,0.55)',
  cursor: 'pointer',
  color: '#004c99',
  transition: 'all .3s ease',
  selectors: { '&:hover': { background: 'rgba(255,255,255,0.85)' } },
});

export const mobileNavList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  marginTop: '0.5rem',
});

export const mobileNavLink = style({
  padding: '0.875rem 1rem',
  borderRadius: '14px',
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.98rem',
  color: 'rgba(29,29,31,0.78)',
  transition: 'background .3s,color .3s',
  selectors: {
    '&:hover': { background: 'rgba(0,102,204,0.07)', color: '#0066cc' },
  },
});

export const mobileNavLinkActive = style([
  mobileNavLink,
  {
    background: 'linear-gradient(90deg, rgba(0,102,204,0.15), rgba(0,102,204,0.05))',
    color: '#0066cc',
    selectors: {
      '&:hover': { background: 'linear-gradient(90deg, rgba(0,102,204,0.22), rgba(0,102,204,0.1))' },
    },
  },
]);

export const overlay = style({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.25)',
  backdropFilter: 'blur(2px)',
  WebkitBackdropFilter: 'blur(2px)',
  opacity: 1,
  transition: 'opacity .35s ease',
  zIndex: 150,
});

export const overlayHidden = style([
  overlay,
  { opacity: 0, pointerEvents: 'none' },
]);

export const themeToggle = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: vars.radius.md,
  border: `1px solid ${vars.color.borderSoft}`,
  background: 'transparent',
  cursor: 'pointer',
  color: vars.color.primaryDeep,
  transition: 'background .25s, color .25s',
  selectors: {
    '&:hover': { background: vars.color.accentSoft },
    '&:focus-visible': { outline: 'none', boxShadow: vars.shadow.focus },
  },
});
