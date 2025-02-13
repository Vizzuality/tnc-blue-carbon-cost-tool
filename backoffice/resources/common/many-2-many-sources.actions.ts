import {
  MethodologySourcesConfig,
  MethodologySourcesConfigEntry,
} from '@shared/config/methodology.config.js';
import { ModelComponentSourceM2M } from '@shared/entities/methodology/model-source-m2m.entity.js';
import { ActionRequest, ActionResponse, ActionContext } from 'adminjs';
import { dataSource } from 'backoffice/datasource.js';

export const fetchRelatedSourcesActionHandler = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === 'post') {
    const { currentAdmin, record } = context;
    const params = request.payload!;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const repository = dataSource.getRepository(ModelComponentSourceM2M);
      return {
        record: record?.toJSON(currentAdmin),
        sources: await repository.find({
          where: params,
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
    const { currentAdmin, record } = context;
    const params = request.payload;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      const repository = dataSource.getRepository(ModelComponentSourceM2M);
      await repository.insert(params);
    } catch (e) {
      let message = e.message;
      if (e.code === '23505') {
        message = "A 'Source' for that 'Source Type' already exists";
      }
      return {
        record: record?.toJSON(currentAdmin),
        notice: {
          message: message,
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
    const params = request.payload!;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const repository = dataSource.getRepository(ModelComponentSourceM2M);
      await repository.delete(params);
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

export const fetchAvailableSourceTypesActionHandler = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method == 'get') {
    const { currentAdmin, resource, database, record } = context;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    const resourceId = request!.query!.resourceId;
    const sourceTypes =
      (
        MethodologySourcesConfig.find(
          (row) =>
            row.entity.name === resourceId && row.relationshipType === 'm2m',
        ) as Extract<MethodologySourcesConfigEntry, { relationshipType: 'm2m' }>
      )?.propertiesWithSources || [];

    return {
      record: record?.toJSON(currentAdmin),
      sourceTypes,
    };
  }
};
