import { style } from '@vanilla-extract/css';

export const accordionContainer = style({
  border: '1px solid black',
});

export const accordionButton = style({
  width: '100%',
  textAlign: 'left',
  padding: '1em',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
});
