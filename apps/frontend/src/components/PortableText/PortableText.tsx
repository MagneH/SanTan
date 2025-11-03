import React from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableText as PortableTextType } from '@/types/sanitySchemas';
import { types } from '@/components/PortableText/types';
import { block } from '@/components/PortableText/block';
import { marks } from '@/components/PortableText/marks';
import { list, listItem } from '@/components/PortableText/list';

const BlockContent = ({ value }: { value?: PortableTextType }) => {
  const components = React.useMemo(
    () => ({
      types,
      block,
      list,
      listItem,
      marks,
    }),
    [],
  );

  // Hvis ingen value eller tom array – returner null
  if (!value || value.length === 0) return null;

  // Send original value direkte til PortableText (unødvendig filtrering fjernet)
  return <PortableText value={value} components={components} />;
};

export default BlockContent;
