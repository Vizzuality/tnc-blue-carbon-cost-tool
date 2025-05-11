import { Box, Label, Input, Text } from '@adminjs/design-system';
import { RecordJSON, ResourceJSON } from 'adminjs';
import { getInputStyle } from '../../../backoffice/components/atoms/styles.js';
import React from 'react';

const TextField: React.FC<{
  label: string;
  record: RecordJSON;
  resource: ResourceJSON;
  property: { path: string };
  onChange: (path: string, value: any) => any;
}> = (props) => {
  const { label, record, resource, property, onChange } = props;

  const prop = resource?.properties?.[property.path];
  const error = record?.errors?.[property.path]?.message;

  return (
    <Box mb="xl" width="100%">
      <Label>{label}</Label>
      <Input
        property={property}
        width="100%"
        value={record?.params?.[property.path] || ''}
        onChange={(e) => onChange(property.path, e.target.value)}
        style={getInputStyle(record?.errors?.[property.path]?.message)}
      />
      {record?.errors?.[property.path]?.message && (
        <Text color="error" mt="sm">
          {record.errors[property.path].message}
        </Text>
      )}
    </Box>
  );
};

export default TextField;
