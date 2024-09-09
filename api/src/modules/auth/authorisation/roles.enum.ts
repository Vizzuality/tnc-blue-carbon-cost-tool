export enum ROLES {
  ADMIN = 'admin',
  PARTNER = 'partner',
  GENERAL_USER = 'general_user',
}

export const ROLES_HIERARCHY = {
  [ROLES.ADMIN]: [ROLES.PARTNER, ROLES.GENERAL_USER],
  [ROLES.PARTNER]: [ROLES.GENERAL_USER],
  [ROLES.GENERAL_USER]: [],
};
