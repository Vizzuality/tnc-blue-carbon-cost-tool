import { Box, Label, Select, Text } from '@adminjs/design-system';
import { RecordJSON, ResourceJSON, useRecord } from 'adminjs';
import { getSelectStyle } from '../../../backoffice/components/atoms/styles.js';
import React from 'react';
import path from 'path';

const SelectorField = (props: {
  label: string;
  record: RecordJSON;
  resource: ResourceJSON;
  property: { path: string };
  onChange: (path: string, value: any) => any;
  availableValues?: { label: string; value: string }[];
}) => {
  const { label, record, resource, property, onChange } = props;

  const prop = resource?.properties?.[property.path];
  const error = record?.errors?.[property.path]?.message;

  const availableValues = prop?.availableValues ?? props.availableValues ?? [];

  return (
    <Box mb="xl" width="100%">
      <Label>{label}</Label>
      <Select
        options={availableValues}
        value={availableValues?.find(
          (opt) => opt.value === record?.params?.[property.path],
        )}
        onChange={(selected) =>
          onChange(property.path, selected?.value || null)
        }
        isClearable
        styles={getSelectStyle(error)}
      />
      {error && (
        <Text color="error" mt="sm">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default SelectorField;
