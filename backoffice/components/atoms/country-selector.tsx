import React, { useEffect, useState } from 'react';
import { BasePropertyProps } from 'adminjs';
import { borderWidths, Box, Label, Select, Text } from '@adminjs/design-system';
import { Config } from '../../../backoffice/components/config/Config.js';
import { getSelectStyle } from '../../../backoffice/components/atoms/styles.js';

const CountrySelector: React.FC<BasePropertyProps> = ({
  property,
  record,
  onChange,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );

  useEffect(() => {
    fetch(Config.ADMINJS_CONFIG_ENDPOINT).then(async (res) => {
      const config = await res.json();

      const countriesRes = await fetch(
        `${config.apiUrl}/custom-projects/available-countries`,
      );

      const countries = await countriesRes.json();
      setOptions(
        countries.data.map((country: { code: string; name: string }) => ({
          value: country.code,
          label: country.name,
        })),
      );
    });
  }, []);

  return (
    <Box width={'100%'}>
      <Label
        style={{
          textTransform: 'capitalize',
        }}
      >
        Country
      </Label>
      <Select
        //@ts-expect-error
        property={{ path: 'countryCode' }}
        options={options}
        value={options.find(
          (option) => option.value === record!.params[property.path],
        )}
        onChange={(selected) => onChange!(property.path, selected?.value)}
        isClearable
        styles={getSelectStyle(record?.errors?.[property.path]?.message)}
      />
      {record?.errors?.[property.path]?.message && (
        <Text color="error" mt="sm">
          {record.errors[property.path].message}
        </Text>
      )}
      {/* <div style={{ height: '24px' }}></div> */}
    </Box>
  );
};

export default CountrySelector;
