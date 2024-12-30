import { UserDto } from "@shared/dtos/users/user.dto";
import { SignJWT } from "jose";
import { jwtVerify } from "jose";

import { AppSession } from "@/lib/auth/types";
import { client } from "@/lib/query-client";

import { JWT_SECRET, TOKEN_KEY } from "./constants";

/**
 * Validates an authentication token by making a request to the auth service
 * @param token - The bearer token to validate
 * @returns Promise that resolves to true if the token is valid, false otherwise
 */
export async function validateAccessToken(token?: string): Promise<boolean> {
  if (!token) return false;

  try {
    const response = await client.auth.validateToken.query({
      query: { tokenType: TOKEN_KEY },
      headers: { authorization: `Bearer ${token}` },
    });

    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * Generates a signed JWT containing user information and access token
 * @param payload - Object containing user data and access token
 * @param payload.user - User data transfer object
 * @param payload.accessToken - Access token to include in the JWT
 * @returns Promise that resolves to the signed JWT string
 */
export async function generateUserJWT(payload: {
  user: UserDto;
  accessToken: string;
}): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);
}

/**
 * Verifies and decodes a JWT token
 * @param token - The JWT token to verify
 * @returns Promise resolving to decoded payload if valid, null otherwise
 */
export async function verifyUserJWT(token: string): Promise<AppSession | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const isValid = await validateAccessToken(payload.accessToken as string);

    if (!isValid) {
      return null;
    }

    return {
      user: payload.user as UserDto,
      accessToken: payload.accessToken as string,
    };
  } catch (err) {
    return null;
  }
}
