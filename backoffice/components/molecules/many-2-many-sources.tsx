import React, { CSSProperties, useEffect, useState } from 'react';
import { ApiClient, BasePropertyProps, RecordJSON, useNotice } from 'adminjs';
import { Badge, Label, Icon, Button, Select } from '@adminjs/design-system';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity.js';
import styled from 'styled-components';
import { SelectorOption } from '../atoms/selector.type.js';

export type Many2ManySourcesProps = BasePropertyProps & {
  many2manyEntityName: string;
  availableSourceTypes: string[];
  // Compatible with typeorm find entity fields
  computeFetchParams: (record: RecordJSON) => Record<string, unknown>;
  // Compatible with typeorm insert entity fields
  computeAddParams: (
    record: RecordJSON,
    typeSelection: SelectorOption,
    sourceSelection: SelectorOption,
  ) => Record<string, unknown>;
  computeDeleteParams: (
    record: RecordJSON,
    item: Object,
  ) => Record<string, unknown>;
};

const Many2ManySources: React.FC<Many2ManySourcesProps> = ({
  record,
  property,
  where,
  many2manyEntityName,
  availableSourceTypes,
  computeFetchParams,
  computeAddParams,
  computeDeleteParams,
}) => {
  if (!record) return null;

  const isListView = where === 'list';
  const isEditView = where === 'edit';

  const notify = useNotice();
  const api = new ApiClient();

  const [selectedSourceType, setSelectedSourceType] =
    useState<SelectorOption | null>(null);

  const [availableSources, setAvailableSources] = useState<SelectorOption[]>(
    [],
  );
  const [selectedSource, setSelectedSource] = useState<SelectorOption | null>(
    null,
  );

  const [relatedSources, setRelatedSources] = useState([]);

  const fetchRelatedSources = async () => {
    const res = await api.resourceAction({
      resourceId: property.resourceId,
      actionName: 'fetchRelatedSourcesAction',
      data: {
        many2manyEntityName,
        params: computeFetchParams(record),
      },
    });
    if (res.status == 200) {
      const { notice, sources } = res.data;
      if (notice?.type === 'error') {
        return notify(notice);
      }

      setRelatedSources(sources || []);
    }
  };

  const fetchAvailableDataSources = async () => {
    const response = await api.resourceAction({
      resourceId: 'ModelComponentSource',
      actionName: 'list',
    });

    if (response.data) {
      setAvailableSources(
        response.data.records.map((entry: { params: ModelComponentSource }) => {
          return {
            value: entry.params.id,
            label: entry.params.name,
          };
        }),
      );
    }
  };

  useEffect(() => {
    fetchRelatedSources();
    if (isEditView === true) {
      fetchAvailableDataSources();
    }
  }, []);

  const handleAddClick = async (event: Event) => {
    event.preventDefault();

    if (selectedSourceType && selectedSource) {
      const res = await fetch(
        `/admin/api/resources/${property.resourceId}/records/${record.id}/addSourceAction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            many2manyEntityName,
            params: computeAddParams(
              record,
              selectedSourceType,
              selectedSource,
            ),
          }),
        },
      );
      if (res.status == 200) {
        const { notice } = await res.json();
        if (notice.type === 'error') {
          return notify(notice);
        }
      }
      fetchRelatedSources();
    }

    setSelectedSourceType(null);
    setSelectedSource(null);
  };

  const handleDeleteClick = async (item: any) => {
    const res = await fetch(
      `/admin/api/resources/${property.resourceId}/records/${record.id}/deleteSourceAction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          many2manyEntityName,
          params: computeDeleteParams(record, item),
        }),
      },
    );
    if (res.status == 200) {
      const { notice } = await res.json();
      if (notice.type === 'error') {
        return notify(notice);
      }

      fetchRelatedSources();
    }
  };

  return (
    <>
      {isListView === false && (
        <Label
          style={{
            textTransform: 'capitalize',
          }}
        >
          {property.label}
        </Label>
      )}
      <div>
        {relatedSources.map((item: any) => (
          <div
            key={item.source.id + item.emissionFactor + item.emissionFactorType}
            style={{
              marginBottom: '1rem',
            }}
          >
            <Badge>
              {item.emissionFactorType} - {item.source.name}
              {isEditView === true && (
                <span
                  style={{
                    cursor: 'pointer',
                    marginLeft: '.5rem',
                  }}
                >
                  <Icon icon="X" onClick={() => handleDeleteClick(item)} />
                </span>
              )}
            </Badge>
          </div>
        ))}
      </div>
      {isEditView === true && (
        <AddSourceGrid>
          <AddSourceGridItem
            style={GridLabelStyle}
            colStart={1}
            colEnd={1}
            rowStart={1}
            rowEnd={1}
          >
            <Label
              style={{
                textTransform: 'capitalize',
              }}
            >
              Source Type
            </Label>
          </AddSourceGridItem>
          <AddSourceGridItem
            style={GridLabelStyle}
            colStart={2}
            colEnd={2}
            rowStart={1}
            rowEnd={1}
          >
            <Label
              style={{
                textTransform: 'capitalize',
              }}
            >
              Source
            </Label>
          </AddSourceGridItem>
          <AddSourceGridItem colStart={1} colEnd={1} rowStart={2} rowEnd={2}>
            <Select
              value={selectedSourceType}
              options={availableSourceTypes.map((type) => ({
                label: type,
                value: type,
              }))}
              onChange={(selected) => setSelectedSourceType(selected)}
            />
          </AddSourceGridItem>
          <AddSourceGridItem colStart={2} colEnd={2} rowStart={2} rowEnd={2}>
            <Select
              value={selectedSource}
              options={availableSources}
              onChange={(selected) => setSelectedSource(selected)}
            />
          </AddSourceGridItem>
          <AddSourceGridItem
            style={{ display: 'flex' }}
            colStart={3}
            colEnd={3}
            rowStart={2}
            rowEnd={2}
          >
            <Button
              size="sm"
              variant="contained"
              color="info"
              onClick={(event: Event) => handleAddClick(event)}
            >
              <Icon icon="Plus" />
              Add source
            </Button>
          </AddSourceGridItem>
        </AddSourceGrid>
      )}
    </>
  );
};

const AddSourceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  column-gap: 0.5rem;
  min-width: 400px;
  max-width: 600px;
`;

const AddSourceGridItem = styled.div.withConfig({
  shouldForwardProp: (prop: string) =>
    !['colStart', 'colEnd', 'rowStart', 'rowEnd'].includes(prop),
})`
  grid-column: ${({ colStart, colEnd }: { colStart: number; colEnd: number }) =>
    `${colStart} / ${colEnd}`};
  grid-row: ${({ rowStart, rowEnd }: { rowStart: number; rowEnd: number }) =>
    `${rowStart} / ${rowEnd}`};
`;

const GridLabelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
};

export default Many2ManySources;
