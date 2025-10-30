import React from 'react';
import { PortableText } from '@portabletext/react';
import type { PortableText as PortableTextType } from '@/types/sanitySchemas';
import { types } from '@/components/PortableText/types';
import { block } from '@/components/PortableText/block';
import { marks } from '@/components/PortableText/marks';
import { list } from '@/components/PortableText/list';

const BlockContent = ({ value }: { value?: PortableTextType }) => {
  const components = React.useMemo(
    () => ({
      types,
      list,
      block,
      marks,
    }),
    [],
  );

  const componentTypeKeys = React.useMemo(() => Object.keys(components.types), [components.types]);

  const filteredComponents = React.useMemo(
    () =>
      value?.filter(
        (component) =>
          [...componentTypeKeys, 'block', 'span'].includes(component._type) && typeof component._type !== 'undefined',
      ),
    [value, componentTypeKeys],
  );

  if (!filteredComponents || filteredComponents.length === 0) {
    return null;
  }

  return <PortableText value={filteredComponents} components={components} />;
};

export default BlockContent;
