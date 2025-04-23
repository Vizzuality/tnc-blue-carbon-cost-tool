import { ResourceWithOptions } from 'adminjs';
import { User } from '@shared/entities/users/user.entity.js';
import { createUserAction } from './user.actions.js';
import { GLOBAL_COMMON_PROPERTIES } from '../common/common.resources.js';

export const UserResource: ResourceWithOptions = {
  resource: User,
  options: {
    translations: {
      en: {
        labels: {
          User: 'User Accounts',
        },
      },
    },
    navigation: {
      name: 'User Management',
      icon: 'User',
    },
    sort: {
      sortBy: 'name',
      direction: 'asc',
    },
    properties: {
      ...GLOBAL_COMMON_PROPERTIES,
      password: { isVisible: false },
      isActive: { isVisible: false },
      email: { isRequired: true },
      role: { isRequired: true },
      partnerName: { isRequired: true },
    },
    actions: {
      new: {
        actionType: 'resource',
        handler: createUserAction,
      },
    },
  },
};
