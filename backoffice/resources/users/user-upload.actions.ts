import { usersContract } from '@shared/contracts/users.contract.js';
import {
  ActionResponse,
  ActionRequest,
  ActionContext,
  ValidationError,
} from 'adminjs';
import { CommonActions } from 'backoffice/resources/common.actions.js';

const deleteBeforeHook = async (
  request: any,
  context: ActionContext,
): Promise<ActionRequest> => {
  if (request.method !== 'post') return request;

  const backofficeCookie = CommonActions.extractBackofficeCookie(request);
  const cookieToSend = `backoffice=${backofficeCookie};`;

  let res: Response;
  const url = `${process.env.API_URL}${usersContract.deleteUploadedData.path.replace(':id', context.record!.id())}`;
  res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieToSend,
    },
  });

  if (res.status > 399) {
    console.error('Error response:', res);
    throw new ValidationError({}, new Error('File deletion failed'));
  }

  return request;
};

const deleteAfterHook = async (
  response: ActionResponse,
  request: ActionRequest,
  context: ActionContext,
) => {
  return {
    ...response,
    notice: {
      message: 'Data successfully deleted!',
      type: 'success',
    },
    redirectUrl: context.h.resourceActionUrl({
      resourceId: context.resource.id(),
      actionName: 'list',
    }),
  };
};
export const UserUploadActions = {
  deleteBeforeHook,
  deleteAfterHook,
};
