import { ResourceWithOptions } from "adminjs";
import { User } from "@shared/entities/users/user.entity.js";

export const userResource: ResourceWithOptions = {
  resource: User,
  options: {
    navigation: {
      name: "Data Management",
      icon: "Database",
    },
    properties: {
      id: { isVisible: false },
      password: { isVisible: false },
    },
  },
};
