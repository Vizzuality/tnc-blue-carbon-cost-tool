import { TOKEN_TYPE_ENUM } from "@shared/schemas/auth/token-type.schema";

export const TOKEN_KEY = TOKEN_TYPE_ENUM.ACCESS;
export const SIGNIN_PATH = "/auth/signin?expired=true";
export const JWT_SECRET = process.env.NEXTAUTH_SECRET!;
