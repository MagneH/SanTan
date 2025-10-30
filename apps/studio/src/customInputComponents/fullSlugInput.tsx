import { Stack, Text, TextInput } from '@sanity/ui';
import React from 'react';
import type { StringInputProps, StringSchemaType } from 'sanity';

import { useFullSlugComputation } from '../hooks/useFullSlugComputation';

export function FullSlugInput(props: StringInputProps<StringSchemaType>) {
  const { value } = props;

  const { computed, isComputing, error } = useFullSlugComputation({
    debounceMs: 300,
    maxDepth: 5,
  });

  // Display the computed value or the stored value (never write back)
  const displayValue = computed ?? value ?? '';

  return (
    <Stack space={2}>
      <Text size={1} muted>
        {error ? (
          <span style={{ color: 'red' }}>⚠️ {error}</span>
        ) : isComputing ? (
          'Computing fullSlug…'
        ) : computed ? (
          `Auto-generated: ${computed}`
        ) : (
          'Full slug will auto-generate when slug is set.'
        )}
      </Text>
      <TextInput readOnly value={displayValue} placeholder="Automatically computed" />
    </Stack>
  );
}
