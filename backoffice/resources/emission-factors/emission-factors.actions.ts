import { EmissionFactors } from '@shared/entities/carbon-inputs/emission-factors.entity.js';
import { EmissionFactorsSource } from '@shared/entities/methodology/emission-factor-source.entity.js';
import { ModelComponentSource } from '@shared/entities/methodology/model-component-source.entity.js';
import { ActionRequest, ActionResponse, ActionContext } from 'adminjs';
import { dataSource } from 'backoffice/datasource.js';

export const fetchRelatedSourcesActionHandler = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === 'post') {
    const { currentAdmin, record } = context;
    const emissionFactorId = request.payload!.id;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      const repository = dataSource.getRepository(EmissionFactorsSource);
      return {
        record: record?.toJSON(currentAdmin),
        sources: await repository.find({
          where: { emissionFactor: emissionFactorId },
          relations: ['source'],
        }),
      };
    } catch (e) {
      return {
        record: record?.toJSON(currentAdmin),
        notice: {
          message: e.message,
          type: 'error',
        },
      };
    }
  }
};

export const addSourceActionHandler = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === 'post') {
    const { currentAdmin, resource, database, record } = context;
    const { sourceId, type } = request.payload;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    const emissionFactorsSource: EmissionFactorsSource = {
      emissionFactor: { id: record?.params.id } as unknown as EmissionFactors,
      source: { id: sourceId } as unknown as ModelComponentSource,
      emissionFactorType: type,
    };

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      const repository = dataSource.getRepository(EmissionFactorsSource);
      await repository.insert(emissionFactorsSource);
    } catch (e) {
      return {
        record: record?.toJSON(currentAdmin),
        notice: {
          message: e.message,
          type: 'error',
        },
      };
    }

    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: 'Source deleted successfully',
        type: 'success',
      },
    };
  }
};

export const deleteSourceActionHandler = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === 'post') {
    const { currentAdmin, resource, database, record } = context;
    const { sourceId, type } = request.payload;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const emissionFactorsSource: EmissionFactorsSource = {
        emissionFactor: { id: record?.params.id } as unknown as EmissionFactors,
        source: { id: sourceId } as unknown as ModelComponentSource,
        emissionFactorType: type,
      };

      const repository = dataSource.getRepository(EmissionFactorsSource);
      await repository.delete(emissionFactorsSource);
    } catch (e) {
      return {
        record: record?.toJSON(currentAdmin),
        notice: {
          message: e.message,
          type: 'error',
        },
      };
    }

    return {
      record: record?.toJSON(currentAdmin),
      notice: {
        message: 'Source deleted successfully',
        type: 'success',
      },
    };
  }
};
