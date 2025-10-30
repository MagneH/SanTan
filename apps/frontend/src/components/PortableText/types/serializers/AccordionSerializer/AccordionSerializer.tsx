import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableTextTypeComponentProps } from '@portabletext/react';
import type { PortableTextBlock } from '@sanity/types';
import {
  accordionButton,
  accordionContainer,
} from '@/components/PortableText/types/serializers/AccordionSerializer/AccordionSerializer.css.ts';

type AccordionProps = {
  title: string;
  content: PortableTextBlock | undefined;
};

export const AccordionSerializer: React.FC<PortableTextTypeComponentProps<AccordionProps>> = ({
  value: { title, content },
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={accordionContainer}>
      <button className={accordionButton} onClick={() => handleClick()}>
        {title}
      </button>
      {isOpen ? (
        <div style={{ padding: '1em', background: '#f9f9f9' }}>{content ? <PortableText value={content} /> : null}</div>
      ) : null}
    </div>
  );
};
