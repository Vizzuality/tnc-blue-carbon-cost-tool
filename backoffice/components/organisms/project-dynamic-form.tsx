import React, {
  useState,
  useEffect,
  useLayoutEffect,
  memo,
  useCallback,
} from 'react';
import {
  Box,
  Button,
  Label,
  Input,
  Select,
  Loader,
  Text,
} from '@adminjs/design-system';
import {
  useRecord,
  useNotice,
  ApiClient,
  RecordJSON,
  ResourceJSON,
} from 'adminjs';
import CountrySelector from '../atoms/country-selector.js';
import { Config } from '../../../backoffice/components/config/Config.js';
import SelectorField from '../../../backoffice/components/atoms/selector-field.js';
import TextField from '../../../backoffice/components/atoms/text-field.js';

export enum CARBON_REVENUES_TO_COVER {
  OPEX = 'Opex',
  CAPEX_AND_OPEX = 'Capex and Opex',
}

// const api = new ApiClient();

const ProjectDynamicForm = (props: any) => {
  const { record: initialRecord, resource, action } = props;
  const { record, handleChange, setRecord } = useRecord(
    initialRecord,
    resource.id,
  );
  const [submitting, setSubmitting] = useState(false);
  const addNotice = useNotice();

  const [config, setConfig] = useState<{ apiUrl: string } | undefined>(
    undefined,
  );

  useLayoutEffect(() => {
    fetch(Config.ADMINJS_CONFIG_ENDPOINT).then(async (res) => {
      const config = await res.json();
      setConfig(config);
    });
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const createProjectDto = {
        projectName: record.params.projectName,
        countryCode: record.params.countryCode,
        ecosystem: record.params.ecosystem,
        activity: record.params.activity,
        projectSizeHa: Number.parseInt(record.params.projectSize),
        carbonRevenuesToCover: record.params.carbonRevenuesToCover,
        initialCarbonPriceAssumption: Number.parseFloat(
          record.params.initialCarbonPriceAssumption,
        ),
        parameters: {},
      };

      if (createProjectDto.activity === 'Conservation') {
        const projectSpecificEmissionFactor = Number.parseFloat(
          record.params.projectSpecificEmissionFactor,
        );
        const emissionFactorAGB = Number.parseFloat(
          record.params.emissionFactorAGB,
        );
        const emissionFactorSOC = Number.parseFloat(
          record.params.emissionFactorSOC,
        );
        createProjectDto.parameters = {
          lossRateUsed: record.params.lossRateUsed,
          emissionFactorUsed: record.params.emissionFactorUsed,
          projectSpecificEmission: record.params.projectSpecificEmission,
          projectSpecificLossRate: record.params.projectSpecificLossRate,
          projectSpecificEmissionFactor:
            Number.isNaN(projectSpecificEmissionFactor) === false
              ? projectSpecificEmissionFactor
              : undefined,
          emissionFactorAGB:
            Number.isNaN(emissionFactorAGB) === false
              ? emissionFactorAGB
              : undefined,
          emissionFactorSOC:
            Number.isNaN(emissionFactorSOC) === false
              ? emissionFactorSOC
              : undefined,
        };
      } else if (createProjectDto.activity === 'Restoration') {
        const projectSpecificSequestrationRate = Number.parseFloat(
          record.params.projectSpecificSequestrationRate,
        );
        const plantingSuccessRate = Number.parseFloat(
          record.params.plantingSuccessRate,
        );
        const restorationYearlyBreakdown = Number.parseFloat(
          record.params.restorationYearlyBreakdown,
        );
        createProjectDto.parameters = {
          restorationActivity: record.params.restorationActivity,
          tierSelector: record.params.tierSelector,
          projectSpecificSequestrationRate:
            Number.isNaN(projectSpecificSequestrationRate) === false
              ? projectSpecificSequestrationRate
              : undefined,
          plantingSuccessRate:
            Number.isNaN(plantingSuccessRate) === false
              ? plantingSuccessRate
              : undefined,
          restorationYearlyBreakdown:
            Number.isNaN(restorationYearlyBreakdown) === false
              ? restorationYearlyBreakdown
              : undefined,
        };
      }

      const response = await fetch(`${config?.apiUrl}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createProjectDto),
      });
      const responseData = await response.json();
      if (responseData.errors) {
        setRecord({
          ...record,
          errors: responseData.errors.reduce((acc: any, error: any) => {
            const jsonError = JSON.parse(error.detail);
            console.log('error', jsonError);
            acc[
              jsonError.path.length === 1
                ? jsonError.path[0]
                : jsonError.path[1]
            ] = { message: jsonError.message };
            return acc;
          }, {}),
        });
        addNotice({
          message: 'Some fields are invalid. Please check your input.',
          type: 'error',
        });
      } else {
        console.log('responseData', responseData);
        setRecord({
          ...record,
          errors: {},
        });
        window.location.href = `/admin/resources/${resource.id}/records/${responseData.data.id}/show`;
        addNotice({
          message: 'Data inserted successfully',
          type: 'success',
        });
      }
    } catch (error) {
      addNotice({
        message: 'Error saving record',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box variant="white" p="xl">
      <TextField
        label="Project Name"
        record={record}
        resource={resource}
        property={{ path: 'projectName' }}
        onChange={(path, value) => handleChange(path, value)}
      />
      <Box mb="xl">
        <CountrySelector
          property={{ path: 'countryCode' }}
          record={record}
          error={record?.errors?.countryCode?.message}
          onChange={(path, value) => handleChange(path, value)}
        />
      </Box>
      <SelectorField
        label="Ecosystem"
        record={record}
        resource={resource}
        property={{ path: 'ecosystem' }}
        onChange={(path, value) => handleChange(path, value)}
      />
      <SelectorField
        label="Activity"
        record={record}
        resource={resource}
        property={{ path: 'activity' }}
        onChange={(path, value) => handleChange(path, value)}
      />
      <TextField
        label="Project Size"
        record={record}
        resource={resource}
        property={{ path: 'projectSize' }}
        onChange={(path, value) => handleChange(path, value)}
      />
      <SelectorField
        label="Carbon Revenues to Cover"
        record={record}
        resource={resource}
        property={{ path: 'carbonRevenuesToCover' }}
        onChange={(path, value) => handleChange(path, value)}
        availableValues={Object.keys(CARBON_REVENUES_TO_COVER).map(
          (key: keyof typeof CARBON_REVENUES_TO_COVER) => ({
            label: CARBON_REVENUES_TO_COVER[key],
            value: CARBON_REVENUES_TO_COVER[key],
          }),
        )}
      />
      <TextField
        label="Initial Carbon Price Assumption"
        record={record}
        resource={resource}
        property={{ path: 'initialCarbonPriceAssumption' }}
        onChange={(path, value) => handleChange(path, value)}
      />
      <Text fontSize="lg" mb="xl" fontWeight="bold">
        Parameters
      </Text>
      {record?.params?.activity === 'Conservation' && (
        <>
          <SelectorField
            label="Loss Rate Used"
            record={record}
            resource={resource}
            property={{ path: 'lossRateUsed' }}
            onChange={(path, value) => handleChange(path, value)}
            availableValues={['National average', 'Project specific'].map(
              (item: string) => ({
                label: item,
                value: item,
              }),
            )}
          />
          <SelectorField
            label="Emission Factor Used"
            record={record}
            resource={resource}
            property={{ path: 'emissionFactorUsed' }}
            onChange={(path, value) => handleChange(path, value)}
            availableValues={[
              'Tier 1 - Global emission factor',
              'Tier 2 - Country-specific emission factor',
              'Tier 3 - Project specific emission factor',
            ].map((item: string) => ({
              label: item,
              value: item,
            }))}
          />
          <SelectorField
            label="Project Spefic Emission"
            record={record}
            resource={resource}
            property={{ path: 'projectSpecificEmission' }}
            onChange={(path, value) => handleChange(path, value)}
            availableValues={[
              'One emission factor',
              'Two emission factors',
            ].map((item: string) => ({
              label: item,
              value: item,
            }))}
          />
          <TextField
            label="Project Specific Loss Rate"
            record={record}
            resource={resource}
            property={{ path: 'projectSpecificLossRate' }}
            onChange={(path, value) => handleChange(path, value)}
          />
          <TextField
            label="Project Specific Emission Factor"
            record={record}
            resource={resource}
            property={{ path: 'projectSpecificEmissionFactor' }}
            onChange={(path, value) => handleChange(path, value)}
          />
          <TextField
            label="Emission Factor AGB"
            record={record}
            resource={resource}
            property={{ path: 'emissionFactorAGB' }}
            onChange={(path, value) => handleChange(path, value)}
          />
          <TextField
            label="Emission Factor SOC"
            record={record}
            resource={resource}
            property={{ path: 'emissionFactorSOC' }}
            onChange={(path, value) => handleChange(path, value)}
          />
        </>
      )}
      {record?.params?.activity === 'Restoration' && (
        <>
          <SelectorField
            label="Restoration Activity"
            record={record}
            resource={resource}
            property={{ path: 'restorationActivity' }}
            onChange={(path, value) => handleChange(path, value)}
            availableValues={['Hybrid', 'Hydrology', 'Planting'].map(
              (item: string) => ({
                label: item,
                value: item,
              }),
            )}
          />
          <SelectorField
            label="Tier Selector"
            record={record}
            resource={resource}
            property={{ path: 'tierSelector' }}
            onChange={(path, value) => handleChange(path, value)}
            availableValues={[
              'Tier 1 - IPCC default value',
              'Tier 2 - Country-specific rate',
              'Tier 3 - Project-specific rate',
            ].map((item: string) => ({
              label: item,
              value: item,
            }))}
          />
          <TextField
            label="Project Specific Sequestration Rate"
            record={record}
            resource={resource}
            property={{ path: 'projectSpecificSequestrationRate' }}
            onChange={(path, value) => handleChange(path, value)}
          />
          <TextField
            label="Planting Success Rate"
            record={record}
            resource={resource}
            property={{ path: 'plantingSuccessRate' }}
            onChange={(path, value) => handleChange(path, value)}
          />
          <TextField
            label="Restoration Yearly Breakdown"
            record={record}
            resource={resource}
            property={{ path: 'restorationYearlyBreakdown' }}
            onChange={(path, value) => handleChange(path, value)}
          />
        </>
      )}
      <Box mt="xxl">
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {/* {submitting ? <Loader /> : 'Save'} */}
          {'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectDynamicForm;
