import { BaseAuthProvider, LoginHandlerOptions } from "adminjs";
import { User } from "@shared/entities/users/user.entity.js";
import { ROLES } from "@shared/entities/users/roles.enum.js";

export class AuthProvider extends BaseAuthProvider {
  override async handleLogin(opts: LoginHandlerOptions, context?: any) {
    const { email, password } = opts.data;
    try {
      const response = await fetch(
        "http://localhost:4000/authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      if (response.ok) {
        const data: { user: User } = await response.json();
        if (this.isAdmin(data.user)) {
          return data.user;
        }
        return null;
      }

      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  private isAdmin(user: User) {
    return user.role === ROLES.ADMIN;
  }
}
