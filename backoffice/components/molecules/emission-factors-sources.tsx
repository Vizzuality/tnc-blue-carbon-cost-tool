import React from 'react';
import { BasePropertyProps, RecordJSON } from 'adminjs';
import Many2ManySources from './many-2-many-sources.js';
import { SelectorOption } from 'backoffice/components/atoms/selector.type.js';
import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity.js';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity.js';
import { EmissionFactorsSource } from '@shared/entities/methodology/emission-factor-source.entity.js';

// // The import was not working, so I had to hardcode the const here
const AVAILABLE_SOURCE_TYPES = [
  'SOC',
  'AGB',
  'global',
  't2CountrySpecificAGB',
  't2CountrySpecificSOC',
] as const as string[];

const computeFetchParams = (record: RecordJSON) => {
  return {
    emissionFactor: record.id,
  };
};

const computeAddParams = (
  record: RecordJSON,
  typeSelection: SelectorOption,
  sourceSelection: SelectorOption,
) => {
  return {
    emissionFactor: { id: record?.params.id } as unknown as EmissionFactors,
    source: { id: sourceSelection.value } as unknown as ModelComponentSource,
    emissionFactorType: typeSelection.value,
  };
};

const computeDeleteParams = (
  record: RecordJSON,
  item: EmissionFactorsSource,
) => {
  return {
    emissionFactor: { id: record?.params.id } as unknown as EmissionFactors,
    source: { id: item.source.id } as unknown as ModelComponentSource,
    emissionFactorType: item.emissionFactorType,
  };
};

const EmissionFactorSources: React.FC<BasePropertyProps> = ({
  record,
  property,
  where,
  resource,
}) => {
  if (!record) return null;

  return (
    <Many2ManySources
      record={record}
      property={property}
      where={where}
      resource={resource}
      many2manyEntityName={'EmissionFactorsSource'} // Cannot import the entity in front-end components
      availableSourceTypes={AVAILABLE_SOURCE_TYPES}
      computeFetchParams={computeFetchParams}
      computeAddParams={computeAddParams}
      computeDeleteParams={computeDeleteParams}
    />
  );
};

export default EmissionFactorSources;
