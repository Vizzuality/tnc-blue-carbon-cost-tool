import { ResourceWithOptions } from "adminjs";
import { User } from "@shared/entities/users/user.entity.js";
import { createUserAction } from "./user.actions.js";

export const userResource: ResourceWithOptions = {
  resource: User,
  options: {
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
    properties: {
      id: { isVisible: false, isId: true },
      password: { isVisible: false },
      isActive: { isVisible: false },
      email: { isRequired: true },
      role: { isRequired: true },
    },
    actions: {
      new: {
        actionType: "resource",
        handler: createUserAction,
      },
    },
  },
};
