import { ActionRequest, ActionResponse, ActionContext } from 'adminjs';
import { dataSource } from 'backoffice/datasource.js';

export const fetchRelatedSourcesActionHandler = async (
  request: ActionRequest,
  response: ActionResponse,
  context: ActionContext,
) => {
  if (request.method === 'post') {
    const { currentAdmin, record } = context;
    const { params, many2manyEntityName } = request.payload!;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const repository = dataSource.getRepository(many2manyEntityName);
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
    const { many2manyEntityName, params } = request.payload!;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
      const repository = dataSource.getRepository(many2manyEntityName);
      await repository.insert(params);
    } catch (e) {
      let message = e.message;
      if (e.code === '23505') {
        message = "A 'Source' with the same 'Source Type' already exists";
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
    const { many2manyEntityName, params } = request.payload!;

    const accessToken = currentAdmin?.accessToken;
    if (!accessToken) {
      throw new Error('Current Admin token not found');
    }

    try {
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }

      const repository = dataSource.getRepository(many2manyEntityName);
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
