import React, { CSSProperties, useEffect, useState } from 'react';
import { ApiClient, BasePropertyProps, RecordJSON, useNotice } from 'adminjs';
import {
  Badge,
  Label,
  Icon,
  Button,
  Select,
  Link,
} from '@adminjs/design-system';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity.js';
import { styled } from 'styled-components';
import { SelectorOption } from '../atoms/selector.type.js';

export type ComputeAddParamsFuncType = (
  entityName: string,
  record: RecordJSON,
  typeSelection: SelectorOption,
  sourceSelection: SelectorOption,
) => Record<string, unknown>;

export type ComputeDeleteParamsFuncType = (
  entityName: string,
  record: RecordJSON,
  item: Object,
) => Record<string, unknown>;

export type ComputeFetchParamsFuncType = (
  entityName: string,
  record: RecordJSON,
) => Record<string, unknown>;

export type Many2ManySourcesProps = BasePropertyProps & {
  computeFetchParams?: ComputeFetchParamsFuncType;
  computeAddParams?: ComputeAddParamsFuncType;
  computeDeleteParams?: ComputeDeleteParamsFuncType;
};

const Many2ManySources: React.FC<Many2ManySourcesProps> = ({
  record,
  property,
  where,
  computeFetchParams = (entityName: string, record: RecordJSON) => {
    return {
      entityName,
      entityId: record.id,
    };
  },
  computeAddParams = (
    entityName: string,
    record: RecordJSON,
    typeSelection: SelectorOption,
    sourceSelection: SelectorOption,
  ) => {
    return {
      entityName,
      entityId: record?.params.id,
      sourceType: typeSelection.value,
      source: { id: sourceSelection.value },
    };
  },
  computeDeleteParams = (entityName: string, record: RecordJSON, item: any) => {
    return {
      entityName,
      entityId: record?.params.id,
      sourceType: item.sourceType,
      source: { id: item.source.id },
    };
  },
}) => {
  if (!record) return null;

  const isListView = where === 'list';
  const isEditView = where === 'edit';

  const notify = useNotice();
  const api = new ApiClient();

  const [selectedSourceType, setSelectedSourceType] =
    useState<SelectorOption | null>(null);

  const [availableSourceTypes, setAvailableSourceTypes] = useState<
    SelectorOption[]
  >([]);
  const [sourceSearchString, setSourceSearchString] = useState<string>('');
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
      data: computeFetchParams(property.resourceId, record),
    });
    if (res.status == 200) {
      const { notice, sources } = res.data;
      if (notice?.type === 'error') {
        return notify(notice);
      }

      setRelatedSources(sources || []);
    }
  };

  const fetchAvailableDataSources = async (searchString: string = '') => {
    const response = await api.resourceAction({
      resourceId: 'ModelComponentSource',
      actionName: 'list',
      params: {
        filters: {
          name: `%${searchString}%`,
        },
      },
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

  const fetchAvailableSourceTypes = async () => {
    const res = await fetch(
      `/admin/api/resources/${property.resourceId}/records/${record.id}/fetchAvailableSourceTypesAction?resourceId=${property.resourceId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const data = await res.json();
    if (data) {
      // console.log(data);
      setAvailableSourceTypes(
        data.sourceTypes!.map((entry: string) => {
          return {
            value: entry,
            label: entry,
          };
        }),
      );
    }
  };

  useEffect(() => {
    fetchRelatedSources();
    if (isEditView === true) {
      fetchAvailableSourceTypes();
      fetchAvailableDataSources();
    }
  }, []);

  useEffect(() => {
    if (isEditView) {
      fetchAvailableDataSources(sourceSearchString);
    }
  }, [sourceSearchString]);

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
          body: JSON.stringify(
            computeAddParams(
              property.resourceId,
              record,
              selectedSourceType,
              selectedSource,
            ),
          ),
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
        body: JSON.stringify(
          computeDeleteParams(property.resourceId, record, item),
        ),
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
            key={item.sourceType + item.source.id}
            style={{
              marginBottom: '1rem',
            }}
          >
            <Badge>
              <Link
                href={`/admin/resources/ModelComponentSource/records/${item.source.id}/show`}
                style={{
                  color: 'inherit',
                }}
              >
                {item.sourceType} - {item.source.name}
              </Link>
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
              options={availableSourceTypes}
              onChange={(selected) => setSelectedSourceType(selected)}
            />
          </AddSourceGridItem>
          <AddSourceGridItem colStart={2} colEnd={2} rowStart={2} rowEnd={2}>
            <Select
              value={selectedSource}
              options={availableSources}
              onChange={(selected) => setSelectedSource(selected)}
              onInputChange={(inputValue: string) =>
                setSourceSearchString(inputValue)
              }
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
