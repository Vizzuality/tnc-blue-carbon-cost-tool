import { UserWithAccessToken } from "@shared/dtos/users/user.dto";

export interface AppSession {
  user: UserWithAccessToken["user"];
  accessToken: UserWithAccessToken["accessToken"];
}

export interface AuthContextType {
  session: AppSession | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export enum AuthStatus {
  LOADING = "loading",
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
}

export interface AuthApiResponse<T> {
  body: T;
  status: number;
  error?: string;
}
