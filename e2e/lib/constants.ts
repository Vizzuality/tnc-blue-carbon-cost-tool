import { User } from "@shared/entities/users/user.entity";

export const TEST_USER: Pick<
  User,
  "name" | "email" | "password" | "partnerName"
> = {
  name: "John Doe",
  email: "jhondoe@test.com",
  password: "passwordpassword",
  partnerName: "admin",
};

export const PROJECT_NAME = "test";

export const EXTENDED_TIMEOUT = 60_000;

export const ROUTES = {
  home: "/",
  profile: "/profile",
  projects: {
    new: "/projects/new",
    preview: "/projects/preview",
    edit: (id: string) => `/projects/${id}/edit`,
  },
  auth: {
    signin: "/auth/signin",
    signup: "/auth/signup",
    confirmEmail: (token?: string, email?: string) =>
      `/auth/confirm-email/${token}${`?newEmail=${email}`}`,
  },
};

export const EDIT_PROJECT_LINK_REGEX =
  /\/projects\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/edit/;
