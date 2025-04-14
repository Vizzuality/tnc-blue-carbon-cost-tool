import React, { useEffect, useState } from 'react';
import { BasePropertyProps } from 'adminjs';
import { Label, Select } from '@adminjs/design-system';
import { Config } from '../../../backoffice/components/config/Config.js';

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
    <div style={{ marginBottom: '16px' }}>
      <Label
        style={{
          textTransform: 'capitalize',
        }}
      >
        Country
      </Label>
      <Select
        //@ts-expect-error
        options={options}
        value={options.find(
          (option) => option.value === record!.params[property.path],
        )}
        onChange={(selected) => onChange!(property.path, selected?.value)}
        isClearable
      />
      <div style={{ height: '24px' }}></div>
    </div>
  );
};

export default CountrySelector;
