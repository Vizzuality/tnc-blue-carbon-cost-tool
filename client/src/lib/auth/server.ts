"use server";

import { headers, cookies } from "next/headers";

import { TOKEN_KEY } from "@/lib/auth/constants";
import { verifyUserJWT } from "@/lib/auth/jwt";
import { AppSession } from "@/lib/auth/types";

/**
 * Retrieves and validates the current server session
 * @returns Promise resolving to AppSession if valid session exists, null otherwise
 */
export async function getServerSession(): Promise<AppSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_KEY);

  if (!token) return null;

  return await verifyUserJWT(token.value);
}

/**
 * Sets the authentication cookie with the provided token
 * @param token - JWT token string to be stored in cookies
 * @returns Promise<void>
 */
export async function setAuthCookie(token: string): Promise<void> {
  cookies().set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Removes the authentication cookie, effectively ending the session
 * @returns Promise<void>
 */
export async function revokeSession(): Promise<void> {
  cookies().delete(TOKEN_KEY);
}

export async function getServerAuthUrl(): Promise<string> {
  const host = headers().get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}/auth/api`;
}

/**
 * Sets a cookie from response headers
 * @param response - Response object containing set-cookie header
 * @returns Promise<void>
 */
export async function setResponseCookie(headers: Headers): Promise<void> {
  const setCookieHeaders = headers.get("set-cookie");
  if (setCookieHeaders !== null) {
    const [cookieName, cookieValue] = decodeURIComponent(setCookieHeaders)
      .split(";")[0]
      .split("=");

    const cookieStore = cookies();
    cookieStore.set(cookieName, cookieValue, {
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });
  }
}
