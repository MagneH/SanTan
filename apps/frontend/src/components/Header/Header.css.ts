import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

export const header = style({
  padding: calc.multiply('var(--spacing)', 4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#1F2937', // gray-800
  color: 'white',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // shadow-lg
  height: '73px',
  width: '100%',
  overflow: 'hidden',
});

export const menuAndTitleContainer = style({
  display: 'flex',
  alignItems: 'center',
});

export const button = style({
  padding: calc.multiply('var(--spacing)', 2),
  borderRadius: 8, // rounded-lg
  transition: 'background-color 0.3s',
  selectors: {
    '&:hover': {
      backgroundColor: '#374151', // gray-700
    },
  },
});

export const title = style({
  marginLeft: 16, // ml-4
  fontSize: 20, // text-xl
  fontWeight: 600, // font-semibold
});

export const aside = style({
  position: 'fixed',
  top: 0,
  left: 0,
  height: '100%',
  width: '20rem',
  background: '#1a202c',
  color: 'white',
  boxShadow: '0 0 32px 0 rgba(0,0,0,0.5)',
  zIndex: 50,
  display: 'flex',
  flexDirection: 'column',
  transform: 'translateX(-100%)',
});

export const asideOpen = style([
  aside,
  {
    transform: 'translateX(0)',
    transition: 'transform 300ms ease-in-out',
  },
]);

export const asideClosed = style([
  aside,
  {
    // No need to set transform again, already set in aside
    transition: 'transform 300ms ease-in-out',
  },
]);

export const asideButtonContainer = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: calc.multiply('var(--spacing)', 4),
  borderBottom: '1px solid #374151',
});

export const asideHeader = style({
  fontSize: 20,
  fontWeight: 700,
});

export const closeMenuButton = style({
  padding: calc.multiply('var(--spacing)', 2),
  borderRadius: 8,
  transition: 'background-color 0.3s',
  selectors: {
    '&:hover': {
      backgroundColor: '#1F2937',
    },
  },
});

export const navigationContainer = style({
  flex: 1,
  padding: calc.multiply('var(--spacing)', 4),
  overflowY: 'auto',
});

export const navigationLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: calc.multiply('var(--spacing)', 3),
  borderRadius: 8,
  marginBottom: 8,
  transition: 'background-color 0.3s',
  selectors: {
    '&:hover': {
      backgroundColor: '#374151',
    },
  },
});

export const activeNavigationLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: calc.multiply('var(--spacing)', 3),
  borderRadius: 8,
  marginBottom: 8,
  backgroundColor: '#0891b2', // cyan-600
  selectors: {
    '&:hover': {
      backgroundColor: '#0e7490', // cyan-700
    },
  },
});

export const navigationLinkTitle = style({
  fontWeight: 500,
});
