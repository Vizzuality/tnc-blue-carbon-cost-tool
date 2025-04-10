import { projectsContract } from '@shared/contracts/projects.contract.js';
import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  ValidationError,
} from 'adminjs';

const RESPONSE_BODY_TO_FORM_FIELD_NAME = {
  projectName: 'projectName',
  countryCode: 'countryCode',
  ecosystem: 'ecosystem',
  activity: 'activity',
  restorationActivity: 'restorationActivity',
  priceType: 'priceType',
  initialCarbonPriceAssumption: 'initialPriceAssumption',
  projectSizeHa: 'projectSize',
} as const;

const convertFormToRequestBody = (request: ActionRequest) => {
  if (request.payload == null) return {};

  const requestBody = {
    projectName: request.payload.projectName,
    countryCode: request.payload.countryCode,
    ecosystem: request.payload.ecosystem,
    activity: request.payload.activity,
    restorationActivity: request.payload.restorationActivity,
    priceType: request.payload.priceType,
    initialCarbonPriceAssumption:
      Number.parseInt(request.payload.initialPriceAssumption) || 0,
    projectSizeHa: Number.parseInt(request.payload.projectSize),
  };
  return requestBody;
};

const beforeHook = async (request: any, context: ActionContext) => {
  if (request.method !== 'post') return request;

  const cookieIdx = request.rawHeaders.indexOf('Cookie') + 1;
  const cookie = request.rawHeaders[cookieIdx];
  if (!cookie) {
    throw new Error('No cookie found in request headers');
  }

  const requestBody = convertFormToRequestBody(request);

  let res: Response;
  if (context.action.name === 'edit') {
    const url = `${process.env.API_URL}${projectsContract.updateProject.path.replace(':id', context.record!.id())}`;
    res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(requestBody),
    });
  } else {
    const url = `${process.env.API_URL}${projectsContract.createProject.path}`;
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
      body: JSON.stringify(requestBody),
    });
  }

  if (res.status > 499) {
    console.error('Error response:', res);
    throw new Error(`Failed to send request: ${res.statusText}`);
  }

  const responseData = await res.json();
  if (responseData.errors) {
    const validationErrors = responseData.errors.reduce(
      (acc: any, error: any) => {
        const errorDetail = JSON.parse(error.detail);
        const fieldName =
          RESPONSE_BODY_TO_FORM_FIELD_NAME[
            errorDetail.path[0] as keyof typeof RESPONSE_BODY_TO_FORM_FIELD_NAME
          ];
        if (fieldName) {
          acc[fieldName] = { message: errorDetail.message };
        }
        return acc;
      },
      {},
    );
    throw new ValidationError(validationErrors);
  }

  return {
    ...request,
    payload: {},
  };
};

const afterHook = async (
  response: ActionResponse,
  request: ActionRequest,
  context: ActionContext,
) => {
  if (request.method !== 'post') return response;

  const isEdit = context.action.name === 'edit';
  const recordId = context.record?.params?.id;

  if (isEdit && recordId) {
    return {
      ...response,
      notice: {
        message: 'Data successfully updated!',
        type: 'success',
      },
      redirectUrl: context.h.recordActionUrl({
        resourceId: context.resource.id(),
        recordId,
        actionName: 'show',
      }),
    };
  }

  return {
    ...response,
    notice: {
      message: 'Data successfully updated!',
      type: 'success',
    },
    redirectUrl: context.h.resourceActionUrl({
      resourceId: context.resource.id(),
      actionName: 'list',
    }),
  };
};

export const ProjectActions = {
  beforeHook,
  afterHook,
};
