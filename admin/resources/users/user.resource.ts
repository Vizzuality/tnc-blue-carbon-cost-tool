import { ResourceWithOptions } from "adminjs";
import { User } from "@shared/entities/users/user.entity.js";
import { createUserAction } from "./user.actions.js";

export const UserResource: ResourceWithOptions = {
  resource: User,
  options: {
    navigation: {
      name: "User Management",
      icon: "User",
    },
    properties: {
      id: { isVisible: false, isId: true },
      password: { isVisible: false },
      isActive: { isVisible: false },
      email: { isRequired: true },
      role: { isRequired: true },
      partnerName: { isRequired: true },
    },
    actions: {
      new: {
        actionType: "resource",
        handler: createUserAction,
      },
    },
  },
};
