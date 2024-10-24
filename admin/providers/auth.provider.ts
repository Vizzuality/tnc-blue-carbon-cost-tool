import { BaseAuthProvider, LoginHandlerOptions } from "adminjs";

import { ROLES } from "@shared/entities/users/roles.enum.js";
import { UserDto, UserWithAccessToken } from "@shared/dtos/users/user.dto.js";
import { API_URL } from "../index.js";

export class AuthProvider extends BaseAuthProvider {
  override async handleLogin(opts: LoginHandlerOptions, context?: any) {
    const { email, password } = opts.data;
    try {
      const response = await fetch(`${API_URL}/authentication/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data: UserWithAccessToken = await response.json();
        const { user, accessToken } = data;
        if (this.isAdmin(user)) {
          return { ...user, accessToken };
        }
        return null;
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private isAdmin(user: UserDto) {
    return user.role === ROLES.ADMIN;
  }
}
