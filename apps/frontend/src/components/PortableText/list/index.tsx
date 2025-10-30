import type { ReactNode } from 'react';

interface ListProps {
  type?: 'number' | 'bullet' | 'check' | undefined;
  children?: Array<ReactNode> | ReactNode;
}

export const list = ({ type, children }: ListProps) => {
  if (type === 'bullet') {
    return (
      <ul>{Array.isArray(children) ? children.map((c: any) => <li key={c.key}>{c.props.children}</li>) : null}</ul>
    );
  }
  if (type === 'number') {
    return (
      <ol>{Array.isArray(children) ? children.map((c: any) => <li key={c.key}>{c.props.children}</li>) : null}</ol>
    );
  }
  if (type === 'check') {
    return (
      <ol>{Array.isArray(children) ? children.map((c: any) => <li key={c.key}>{c.props.children}</li>) : null}</ol>
    );
  }
};
